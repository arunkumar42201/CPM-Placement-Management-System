package com.cpm.service;

import com.cpm.entity.CompanyProfile;
import com.cpm.entity.Job;
import com.cpm.entity.PlacementDrive;
import com.cpm.repository.CompanyProfileRepository;
import com.cpm.repository.JobRepository;
import com.cpm.repository.PlacementDriveRepository;
import com.cpm.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private PlacementDriveRepository placementDriveRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getActiveJobs() {
        return jobRepository.findByStatus("ACTIVE");
    }

    public List<Job> getCompanyJobs(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Job not found: " + id));
    }

    @Transactional
    public Job createJob(Long companyId, Job job, Long driveId) {
        CompanyProfile company = companyProfileRepository.findById(Objects.requireNonNull(companyId))
                .orElseThrow(() -> new RuntimeException("Company not found: " + companyId));

        job.setCompany(company);

        if (driveId != null) {
            PlacementDrive drive = placementDriveRepository.findById(driveId).orElse(null);
            job.setPlacementDrive(drive);
        }

        job.setStatus("PENDING");

        Job saved = jobRepository.save(Objects.requireNonNull(job));
        if ("ACTIVE".equalsIgnoreCase(saved.getStatus())) {
            String companyName = company.getCompanyName();
            studentProfileRepository.findAll().forEach(profile -> {
                if (profile.getUser() != null) {
                    notificationService.createNotification(
                            profile.getUser(),
                            "New job posted: " + saved.getTitle(),
                            companyName + " published a new " + (saved.getJobType() != null ? saved.getJobType().replace('_', ' ').toLowerCase() : "job") + " opportunity.",
                            "JOB",
                            "/student/jobs"
                    );
                }
            });
        }
        return saved;
    }

    @Transactional
    public Job approveJob(Long id, boolean approve) {
        Job job = getJobById(id);
        if (approve && (job.getCompany() == null || !Boolean.TRUE.equals(job.getCompany().getIsApproved()))) {
            throw new RuntimeException("Company profile must be approved before its job can be activated.");
        }
        job.setStatus(approve ? "ACTIVE" : "REJECTED");
        Job saved = jobRepository.save(Objects.requireNonNull(job));

        String companyName = job.getCompany() != null ? job.getCompany().getCompanyName() : "Recruiter";
        if (job.getCompany() != null && job.getCompany().getUser() != null) {
            notificationService.createNotification(
                    job.getCompany().getUser(),
                    approve ? "Job approved: " + job.getTitle() : "Job needs changes: " + job.getTitle(),
                    approve
                            ? companyName + " job posting is now visible to students."
                            : companyName + " job posting was rejected by the placement administration.",
                    "JOB",
                    "/company/jobs"
            );
        }

        if (approve) {
            studentProfileRepository.findAll().forEach(profile -> {
                if (profile.getUser() != null) {
                    notificationService.createNotification(
                            profile.getUser(),
                            "New job posted: " + saved.getTitle(),
                            companyName + " published a new " + (saved.getJobType() != null
                                    ? saved.getJobType().replace('_', ' ').toLowerCase()
                                    : "job") + " opportunity.",
                            "JOB",
                            "/student/jobs"
                    );
                }
            });
        }

        return saved;
    }

    @Transactional
    public Job updateJob(Long id, Job updated) {
        Job existing = getJobById(id);
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getRequirements() != null) existing.setRequirements(updated.getRequirements());
        if (updated.getRequiredSkills() != null) existing.setRequiredSkills(updated.getRequiredSkills());
        if (updated.getPreferredSkills() != null) existing.setPreferredSkills(updated.getPreferredSkills());
        if (updated.getSalary() != null) existing.setSalary(updated.getSalary());
        if (updated.getSalaryCurrency() != null) existing.setSalaryCurrency(updated.getSalaryCurrency());
        if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if (updated.getWorkMode() != null) existing.setWorkMode(updated.getWorkMode());
        if (updated.getMinCgpa() != null) existing.setMinCgpa(updated.getMinCgpa());
        if (updated.getMaxBacklogs() != null) existing.setMaxBacklogs(updated.getMaxBacklogs());
        if (updated.getBranch() != null) existing.setBranch(updated.getBranch());
        if (updated.getEducation() != null) existing.setEducation(updated.getEducation());
        if (updated.getDeadline() != null) existing.setDeadline(updated.getDeadline());
        if (updated.getOpenings() != null) existing.setOpenings(updated.getOpenings());
        if (updated.getSelectionProcess() != null) existing.setSelectionProcess(updated.getSelectionProcess());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        return jobRepository.save(Objects.requireNonNull(existing));
    }

    @Transactional
    public void deleteJob(Long id) {
        jobRepository.deleteById(Objects.requireNonNull(id));
    }
}
