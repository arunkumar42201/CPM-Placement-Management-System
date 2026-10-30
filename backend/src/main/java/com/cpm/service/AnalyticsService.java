package com.cpm.service;

import com.cpm.dto.DashboardStatsDto;
import com.cpm.entity.PlacementResult;
import com.cpm.entity.StudentSkill;
import com.cpm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PlacementDriveRepository placementDriveRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private PlacementResultRepository placementResultRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private StudentTaskRepository studentTaskRepository;

    @Autowired
    private StudentService studentService;

    public DashboardStatsDto getGlobalDashboardStats(Long studentId) {
        long totalStudents = studentProfileRepository.count();
        long placedStudents = placementResultRepository.countPlacedStudents();
        double placementPercentage = totalStudents > 0 ? Math.round(((double) placedStudents / totalStudents) * 1000.0) / 10.0 : 0.0;

        Double highest = placementResultRepository.findHighestPackage();
        Double average = placementResultRepository.findAveragePackage();

        long totalCompanies = companyProfileRepository.countByIsApprovedTrue();
        long activeDrives = placementDriveRepository.countByStatus("ONGOING") + placementDriveRepository.countByStatus("UPCOMING");
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        long totalInterviews = interviewRepository.count();

        // Department-wise placements
        List<PlacementResult> results = placementResultRepository.findAll();
        Map<String, Long> deptPlacements = new HashMap<>();
        Map<String, Double> packageRanges = new LinkedHashMap<>();
        packageRanges.put("< 6 LPA", 0.0);
        packageRanges.put("6 - 12 LPA", 0.0);
        packageRanges.put("12 - 20 LPA", 0.0);
        packageRanges.put("20+ LPA", 0.0);

        for (PlacementResult r : results) {
            if (r.getStudent() != null && r.getStudent().getDepartment() != null) {
                String dName = r.getStudent().getDepartment().getName();
                deptPlacements.put(dName, deptPlacements.getOrDefault(dName, 0L) + 1);
            }
            if (r.getPackageLpa() != null) {
                double pkg = r.getPackageLpa();
                if (pkg < 6.0) packageRanges.put("< 6 LPA", packageRanges.get("< 6 LPA") + 1);
                else if (pkg <= 12.0) packageRanges.put("6 - 12 LPA", packageRanges.get("6 - 12 LPA") + 1);
                else if (pkg <= 20.0) packageRanges.put("12 - 20 LPA", packageRanges.get("12 - 20 LPA") + 1);
                else packageRanges.put("20+ LPA", packageRanges.get("20+ LPA") + 1);
            }
        }

        // Skill demands
        Map<String, Long> skillDemands = new HashMap<>();
        List<StudentSkill> allSkills = studentSkillRepository.findAll();
        for (StudentSkill ss : allSkills) {
            if (ss.getSkill() != null) {
                String sName = ss.getSkill().getName();
                skillDemands.put(sName, skillDemands.getOrDefault(sName, 0L) + 1);
            }
        }

        DashboardStatsDto.DashboardStatsDtoBuilder builder = DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .eligibleStudents(totalStudents)
                .placedStudents(placedStudents)
                .placementPercentage(placementPercentage)
                .highestPackage(highest != null ? Math.round(highest * 100.0) / 100.0 : 0.0)
                .averagePackage(average != null ? Math.round(average * 100.0) / 100.0 : 0.0)
                .totalCompanies(totalCompanies)
                .activeDrives(activeDrives)
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .totalInterviews(totalInterviews)
                .departmentPlacements(deptPlacements)
                .packageRanges(packageRanges)
                .skillDemands(skillDemands);

        // Student-specific metrics if studentId is supplied
        if (studentId != null) {
            studentProfileRepository.findById(studentId).ifPresent(student -> {
                builder.profileCompletionPercentage(studentService.calculateProfileCompletion(student));
                builder.studentAppliedCount(applicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId).size());
                builder.studentShortlistedCount(applicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId).stream()
                        .filter(a -> "SHORTLISTED".equalsIgnoreCase(a.getStatus()) || 
                                     "TECH_INTERVIEW".equalsIgnoreCase(a.getStatus()) || 
                                     "HR_INTERVIEW".equalsIgnoreCase(a.getStatus()) || 
                                     "OFFERED".equalsIgnoreCase(a.getStatus())).count());
                List<Long> applicationIds = applicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId).stream()
                        .map(application -> application.getId()).toList();
                builder.studentInterviewsCount(interviewRepository.findByApplicationIdIn(applicationIds).size());
                builder.studentOffersCount(placementResultRepository.findByStudentId(studentId).size());
                builder.studentTasksCompleted(studentTaskRepository.countByStudentIdAndCompletedTrue(studentId));
                builder.studentTasksPending(studentTaskRepository.countByStudentIdAndCompletedFalse(studentId));
            });
        }

        return builder.build();
    }
}
