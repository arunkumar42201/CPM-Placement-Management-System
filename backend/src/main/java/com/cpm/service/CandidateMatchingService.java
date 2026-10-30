package com.cpm.service;

import com.cpm.dto.CandidateMatchDto;
import com.cpm.dto.JobRecommendationDto;
import com.cpm.entity.*;
import com.cpm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CandidateMatchingService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    /**
     * Calculates candidate match details and eligibility for a specific job.
     * Scoring weights:
     * - Skills Match: 40% (Token-normalized exact matching against required skills)
     * - Academics (CGPA): 25% (Proportional to 10.0 CGPA scale)
     * - Projects Experience: 20% (7 pts/project up to 20 pts)
     * - Certifications & Internships: 15% (Certifications max 8 pts, Internships max 7 pts)
     * Overall match score is strictly bounded between 0 and 100%.
     */
    public CandidateMatchDto matchCandidate(StudentProfile student, Job job) {
        List<String> eligibilityNotes = new ArrayList<>();
        boolean isEligible = true;

        // 1. CGPA Eligibility Check
        if (job.getMinCgpa() != null) {
            double studentCgpa = student.getCgpa() != null ? student.getCgpa() : 0.0;
            if (studentCgpa < job.getMinCgpa()) {
                isEligible = false;
                eligibilityNotes.add("Requires min CGPA of " + job.getMinCgpa() + " (Student: " + studentCgpa + ")");
            }
        }

        // 2. Backlogs Eligibility Check
        if (job.getMaxBacklogs() != null && student.getActiveBacklogs() != null && student.getActiveBacklogs() > job.getMaxBacklogs()) {
            isEligible = false;
            eligibilityNotes.add("Max " + job.getMaxBacklogs() + " backlogs permitted (Student has " + student.getActiveBacklogs() + ")");
        }

        // 3. Branch / Department Eligibility Check (Normalized multi-branch matching)
        if (!isBranchEligible(job.getBranch(), student.getDepartment())) {
            isEligible = false;
            String studentDeptDisplay = student.getDepartment() != null
                    ? (student.getDepartment().getCode() != null ? student.getDepartment().getCode() : student.getDepartment().getName())
                    : "N/A";
            eligibilityNotes.add("Target branches: " + job.getBranch() + " (Student: " + studentDeptDisplay + ")");
        }

        // 4. Skills Match Calculation (Weight: 40%) - Normalized complete token matching
        List<String> requiredSkills = parseSkills(job.getRequiredSkills());
        Set<String> studentNormalizedSkills = student.getSkills() != null
                ? student.getSkills().stream()
                .filter(ss -> ss.getSkill() != null && ss.getSkill().getName() != null)
                .map(ss -> normalizeToken(ss.getSkill().getName()))
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet())
                : new HashSet<>();

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String req : requiredSkills) {
            if (matchesSkill(req, studentNormalizedSkills)) {
                matchedSkills.add(req);
            } else {
                missingSkills.add(req);
            }
        }

        int skillsScore;
        if (!requiredSkills.isEmpty()) {
            skillsScore = (int) Math.round(((double) matchedSkills.size() / requiredSkills.size()) * 40.0);
        } else {
            skillsScore = 35; // Default baseline score if no specific required skills specified
        }
        skillsScore = Math.min(40, Math.max(0, skillsScore));

        // 5. Academics Score (Weight: 25%)
        int academicsScore = 0;
        if (student.getCgpa() != null) {
            double normalizedCgpa = Math.min(10.0, Math.max(0.0, student.getCgpa()));
            academicsScore = (int) Math.round((normalizedCgpa / 10.0) * 25.0);
        }
        academicsScore = Math.min(25, Math.max(0, academicsScore));

        // 6. Projects Score (Weight: 20%)
        int projectsScore = 0;
        List<String> studentProjectTitles = new ArrayList<>();
        if (student.getProjects() != null && !student.getProjects().isEmpty()) {
            studentProjectTitles = student.getProjects().stream()
                    .map(project -> project != null ? project.getTitle() : null)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            int projectCount = student.getProjects().size();
            projectsScore = Math.min(20, projectCount * 7); // 3+ projects gives full 20 pts
        }

        // 7. Certifications & Internships Score (Weight: 15%)
        int certScore = 0;
        if (student.getCertifications() != null) {
            certScore += Math.min(8, student.getCertifications().size() * 4);
        }
        if (student.getInternships() != null) {
            certScore += Math.min(7, student.getInternships().size() * 4);
        }
        int certificationsScore = Math.min(15, certScore);

        int overallMatchPercentage = Math.min(100, Math.max(0, skillsScore + academicsScore + projectsScore + certificationsScore));

        if (isEligible && eligibilityNotes.isEmpty()) {
            eligibilityNotes.add("Meets all academic & branch criteria");
        }

        return CandidateMatchDto.builder()
                .studentId(student.getId())
                .fullName(student.getUser() != null ? student.getUser().getFullName() : "Student")
                .email(student.getUser() != null ? student.getUser().getEmail() : "")
                .rollNumber(student.getRollNumber())
                .departmentName(student.getDepartment() != null ? student.getDepartment().getName() : "N/A")
                .cgpa(student.getCgpa())
                .activeBacklogs(student.getActiveBacklogs())
                .resumeUrl(student.getResumeUrl())
                .overallMatchPercentage(overallMatchPercentage)
                .isEligible(isEligible)
                .eligibilityNotes(eligibilityNotes)
                .skillsScore(skillsScore)
                .academicsScore(academicsScore)
                .projectsScore(projectsScore)
                .certificationsScore(certificationsScore)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .studentProjects(studentProjectTitles)
                .build();
    }

    public List<CandidateMatchDto> matchCandidatesForJob(Long jobId) {
        Job job = jobRepository.findById(Objects.requireNonNull(jobId))
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        List<StudentProfile> students = studentProfileRepository.findAll();

        return students.stream()
                .map(student -> matchCandidate(student, job))
                .sorted((a, b) -> Integer.compare(b.getOverallMatchPercentage(), a.getOverallMatchPercentage()))
                .collect(Collectors.toList());
    }

    public List<JobRecommendationDto> getRecommendationsForStudent(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(Objects.requireNonNull(studentId))
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        List<Job> activeJobs = jobRepository.findByStatus("ACTIVE");

        return activeJobs.stream().map(job -> {
            CandidateMatchDto match = matchCandidate(student, job);
            return JobRecommendationDto.builder()
                    .job(job)
                    .matchPercentage(match.getOverallMatchPercentage())
                    .isEligible(match.isEligible())
                    .matchingReasons(match.getEligibilityNotes())
                    .matchedSkills(match.getMatchedSkills())
                    .missingSkills(match.getMissingSkills())
                    .build();
        })
        .sorted((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()))
        .collect(Collectors.toList());
    }

    private String normalizeToken(String token) {
        if (token == null) {
            return "";
        }
        String normalized = token.trim().toLowerCase();
        normalized = normalized.replace("&", " and ");
        normalized = normalized.replaceAll("[_\\-/]+", " ");
        normalized = normalized.replaceAll("[^a-z0-9+\\s]", " ");
        normalized = normalized.replaceAll("\\s+", " ").trim();
        return normalized;
    }

    private boolean matchesSkill(String requiredSkill, Set<String> studentNormalizedSkills) {
        String reqNorm = normalizeToken(requiredSkill);
        if (reqNorm.isEmpty()) {
            return false;
        }
        return studentNormalizedSkills.contains(reqNorm);
    }

    private List<String> parseTokens(String input) {
        if (input == null || input.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(input.split("\\s*(?:,|;|\\||\\n|\\s/\\s)\\s*"))
                .map(this::normalizeToken)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private boolean isBranchEligible(String targetBranches, Department studentDept) {
        if (targetBranches == null || targetBranches.trim().isEmpty()) {
            return true;
        }
        List<String> branches = parseTokens(targetBranches);
        if (branches.isEmpty()) {
            return true;
        }
        for (String b : branches) {
            if (b.equals("all") || b.equals("all branches") || b.equals("any") || b.equals("open for all") || b.equals("both")) {
                return true;
            }
        }
        if (studentDept == null) {
            return false;
        }
        String deptCode = normalizeToken(studentDept.getCode());
        String deptName = normalizeToken(studentDept.getName());

        return branches.stream().anyMatch(b ->
                b.equals(deptCode) ||
                b.equals(deptName) ||
                deptName.contains(b) ||
                deptCode.contains(b));
    }

    private List<String> parseSkills(String skillStr) {
        if (skillStr == null || skillStr.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(skillStr.split("\\s*(?:,|;|\\||\\n|\\s/\\s)\\s*"))
                .map(token -> token != null ? token.trim().replaceAll("\\s+", " ") : "")
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
