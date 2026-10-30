package com.cpm.service;

import com.cpm.dto.CandidateMatchDto;
import com.cpm.dto.CompanyApplicationDto;
import com.cpm.entity.*;
import com.cpm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private PlacementResultRepository placementResultRepository;

    @Autowired
    private CandidateMatchingService candidateMatchingService;

    @Autowired
    private NotificationService notificationService;

    public List<Application> getStudentApplications(Long studentId) {
        return applicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId);
    }

    @Transactional(readOnly = true)
    public List<Application> getStudentApplicationsForUser(String email) {
        StudentProfile student = resolveStudentProfile(email);
        return getStudentApplications(student.getId());
    }

    public List<Application> getJobApplications(Long jobId) {
        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
    }

    @Transactional(readOnly = true)
    public List<CompanyApplicationDto> getCompanyApplicationsForCompany(Long companyId, String email) {
        CompanyProfile company = resolveCompanyProfile(email);
        if (!company.getId().equals(companyId)) {
            throw new AccessDeniedException("You can only view applications for your own company.");
        }
        return getCompanyApplicationDtos(company.getId());
    }

    @Transactional(readOnly = true)
    public List<CompanyApplicationDto> getCompanyApplicationsForUser(String email) {
        CompanyProfile company = resolveCompanyProfile(email);
        return getCompanyApplicationDtos(company.getId());
    }

    private List<CompanyApplicationDto> getCompanyApplicationDtos(Long companyId) {
        List<Long> jobIds = new java.util.ArrayList<>();
        for (Job job : jobRepository.findByCompanyId(companyId)) {
            jobIds.add(Objects.requireNonNull(job.getId(), "Company job must have an ID"));
        }
        return applicationRepository.findByCompanyId(jobIds)
                .stream()
                .map(this::toCompanyApplicationDto)
                .toList();
    }

    private StudentProfile resolveStudentProfile(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Student profile not found for the current user.");
        }

        return userRepository.findByEmailIgnoreCase(email.trim())
                .flatMap(user -> studentProfileRepository.findByUserId(user.getId()))
                .or(() -> userRepository.findByEmail(email.trim())
                        .flatMap(user -> studentProfileRepository.findByUserId(user.getId())))
                .orElseThrow(() -> new RuntimeException("Student profile not found for the current user."));
    }

    private CompanyProfile resolveCompanyProfile(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Company profile not found for the current user.");
        }

        return userRepository.findByEmailIgnoreCase(email.trim())
                .flatMap(user -> companyProfileRepository.findByUserId(user.getId()))
                .or(() -> userRepository.findByEmail(email.trim())
                        .flatMap(user -> companyProfileRepository.findByUserId(user.getId())))
                .orElseThrow(() -> new RuntimeException("Company profile not found for the current user."));
    }

    private CompanyApplicationDto toCompanyApplicationDto(Application application) {
        StudentProfile student = application.getStudent();
        Job job = application.getJob();
        CompanyProfile company = job != null ? job.getCompany() : null;

        return CompanyApplicationDto.builder()
                .id(application.getId())
            .applicationId(application.getId())
                .companyId(company != null ? company.getId() : null)
                .studentId(student != null ? student.getId() : null)
                .studentName(student != null && student.getUser() != null ? student.getUser().getFullName() : null)
                .email(student != null && student.getUser() != null ? student.getUser().getEmail() : null)
            .studentEmail(student != null && student.getUser() != null ? student.getUser().getEmail() : null)
                .jobId(job != null ? job.getId() : null)
                .jobTitle(job != null ? job.getTitle() : null)
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .coverNote(application.getCoverNote())
            .recruiterFeedback(application.getRecruiterFeedback())
            .cgpa(student != null ? student.getCgpa() : null)
            .phone(student != null && student.getUser() != null ? student.getUser().getPhone() : null)
            .resumeUrl(application.getResumeUrl() != null ? application.getResumeUrl() :
                student != null ? student.getResumeUrl() : null)
            .skills(student != null && student.getSkills() != null
                ? student.getSkills().stream()
                    .filter(skill -> skill.getSkill() != null)
                    .map(skill -> skill.getSkill().getName() +
                        (skill.getProficiency() != null && !skill.getProficiency().isBlank()
                            ? " (" + skill.getProficiency() + ")" : ""))
                    .toList()
                : List.of())
            .internships(student != null && student.getInternships() != null
                ? student.getInternships().stream()
                    .map(internship -> internship.getRole() + " at " + internship.getCompanyName())
                    .toList()
                : List.of())
                .build();
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Application not found: " + id));
    }

    public Application getApplicationByIdForUser(Long id, String email) {
        Application application = getApplicationById(id);
        assertCompanyApplicationAccess(application, email);
        return application;
    }

    public void assertCompanyApplicationAccess(Long applicationId, String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found."));
        if (user.getRole() != Role.COMPANY && user.getRole() != Role.RECRUITER) {
            return;
        }

        assertCompanyApplicationAccess(getApplicationById(applicationId), email);
    }

    private void assertCompanyApplicationAccess(Application application, String email) {
        CompanyProfile company = resolveCompanyProfile(email);
        if (application.getJob() == null || application.getJob().getCompany() == null ||
                !company.getId().equals(application.getJob().getCompany().getId())) {
            throw new AccessDeniedException("You can only access applications for your own company.");
        }
    }

    @Transactional
    public Application applyForJobForUser(String email, Long jobId, String coverNote) {
        StudentProfile student = resolveStudentProfile(email);
        return applyForJob(student.getId(), jobId, coverNote);
    }

    @Transactional
    public Application applyForJob(Long studentId, Long jobId, String coverNote) {
        if (applicationRepository.existsByStudentIdAndJobId(studentId, jobId)) {
            throw new RuntimeException("You have already applied for this job!");
        }

        StudentProfile student = studentProfileRepository.findById(Objects.requireNonNull(studentId))
                .orElseThrow(() -> new RuntimeException("Student profile not found: " + studentId));

        Job job = jobRepository.findById(Objects.requireNonNull(jobId))
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        CandidateMatchDto match = candidateMatchingService.matchCandidate(student, job);

        Application application = Application.builder()
                .student(student)
                .job(job)
                .placementDrive(job.getPlacementDrive())
                .status("APPLIED")
                .matchPercentage(match.getOverallMatchPercentage())
                .coverNote(coverNote)
                .resumeUrl(student.getResumeUrl())
                .appliedAt(LocalDateTime.now())
                .build();

        application = applicationRepository.save(Objects.requireNonNull(application));

        // Notify Student
        notificationService.createNotification(
                student.getUser(),
                "Application Submitted",
                "You successfully applied for " + job.getTitle() + " at " + job.getCompany().getCompanyName() + ".",
                "APPLICATION",
                "/student/applications"
        );

        // Notify Company/Recruiter
        if (job.getCompany().getUser() != null) {
            notificationService.createNotification(
                    job.getCompany().getUser(),
                    "New Candidate Application",
                    student.getUser().getFullName() + " applied for " + job.getTitle() + " (" + match.getOverallMatchPercentage() + "% match).",
                    "APPLICATION",
                    "/company/applications"
            );
        }

        return application;
    }

    @Transactional
    public Application updateApplicationStatus(Long applicationId, String newStatus, String feedback) {
        Application app = getApplicationById(applicationId);
        app.setStatus(newStatus);
        if (feedback != null) {
            app.setRecruiterFeedback(feedback);
        }

        app = applicationRepository.save(Objects.requireNonNull(app));

        // Notify student on stage change
        notificationService.createNotification(
                app.getStudent().getUser(),
                "Application Status Update: " + newStatus,
                "Your application for " + app.getJob().getTitle() + " at " + app.getJob().getCompany().getCompanyName() + " has been updated to: " + newStatus,
                "SHORTLIST",
                "/student/applications"
        );

        // If status is OFFERED, automatically record placement result if not already created
        if ("OFFERED".equalsIgnoreCase(newStatus) || "SELECTED".equalsIgnoreCase(newStatus)) {
            if (placementResultRepository.findByStudentIdAndJobId(app.getStudent().getId(), app.getJob().getId()).isEmpty()) {
                PlacementResult result = PlacementResult.builder()
                        .student(app.getStudent())
                        .job(app.getJob())
                        .company(app.getJob().getCompany())
                        .packageLpa(app.getJob().getSalary())
                        .designation(app.getJob().getTitle())
                        .isOfferAccepted(true)
                        .selectionDate(java.time.LocalDate.now())
                        .build();
                placementResultRepository.save(Objects.requireNonNull(result));
            }
        }

        return app;
    }

    @Transactional
    public Interview scheduleInterview(Long applicationId, Interview interview) {
        Application app = getApplicationById(applicationId);
        interview.setApplication(app);
        interview.setStatus("SCHEDULED");
        Interview saved = interviewRepository.save(Objects.requireNonNull(interview));

        // Update application status to the interview round
        if (interview.getRoundName() != null && interview.getRoundName().toLowerCase().contains("hr")) {
            app.setStatus("HR_INTERVIEW");
        } else if (interview.getRoundName() != null && interview.getRoundName().toLowerCase().contains("tech")) {
            app.setStatus("TECH_INTERVIEW");
        } else if (interview.getRoundName() != null && interview.getRoundName().toLowerCase().contains("test")) {
            app.setStatus("APTITUDE_TEST");
        }
        applicationRepository.save(Objects.requireNonNull(app));

        // Notify student
        notificationService.createNotification(
                app.getStudent().getUser(),
                "Interview Scheduled: " + interview.getRoundName(),
                "An interview for " + app.getJob().getTitle() + " (" + interview.getRoundName() + ") has been scheduled on " + interview.getScheduledAt() + ".",
                "INTERVIEW",
                "/student/interviews"
        );

        return saved;
    }

    public List<Interview> getStudentInterviews(Long studentId) {
        List<Long> applicationIds = new java.util.ArrayList<>();
        for (Application application : applicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId)) {
            applicationIds.add(Objects.requireNonNull(application.getId(), "Application must have an ID"));
        }
        return interviewRepository.findByApplicationIdIn(applicationIds);
    }

    public List<Interview> getCompanyInterviews(Long companyId) {
        List<Long> jobIds = new java.util.ArrayList<>();
        for (Job job : jobRepository.findByCompanyId(companyId)) {
            jobIds.add(Objects.requireNonNull(job.getId(), "Company job must have an ID"));
        }

        List<Long> applicationIds = new java.util.ArrayList<>();
        for (Application application : applicationRepository.findByJobIdInOrderByAppliedAtDesc(jobIds)) {
            applicationIds.add(Objects.requireNonNull(application.getId(), "Application must have an ID"));
        }
        return interviewRepository.findByApplicationIdIn(applicationIds);
    }
}
