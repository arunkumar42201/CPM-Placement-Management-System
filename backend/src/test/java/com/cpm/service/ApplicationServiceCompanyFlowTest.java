package com.cpm.service;

import com.cpm.dto.CompanyApplicationDto;
import com.cpm.entity.*;
import com.cpm.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.Objects;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.data.mongodb.uri=mongodb://localhost:27017/cpm_test")
class ApplicationServiceCompanyFlowTest {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Test
    void companyUserCanFetchCompanyApplicationsByJwt() {
        String email = "company.flow.test." + System.currentTimeMillis() + "@example.com";
        User companyUser = userRepository.save(Objects.requireNonNull(User.builder()
                .email(email)
                .password("pw")
                .fullName("Test Recruiter")
                .role(Role.COMPANY)
                .active(true)
                .build()));

        CompanyProfile company = companyProfileRepository.save(Objects.requireNonNull(CompanyProfile.builder()
                .user(companyUser)
                .companyName("Acme Test Company")
                .isApproved(true)
                .build()));

        User studentUser = userRepository.save(Objects.requireNonNull(User.builder()
                .email("student.flow.test." + System.currentTimeMillis() + "@example.com")
                .password("pw")
                .fullName("Jane Candidate")
                .role(Role.STUDENT)
                .active(true)
                .build()));

        StudentProfile student = studentProfileRepository.save(Objects.requireNonNull(StudentProfile.builder()
                .user(studentUser)
                .rollNumber("TESTROLL" + System.currentTimeMillis())
                .enrollmentNumber("TESTENR" + System.currentTimeMillis())
                .cgpa(9.2)
                .build()));

        Job job = jobRepository.save(Objects.requireNonNull(Job.builder()
                .company(company)
                .title("Test Software Engineer")
                .description("Test role")
                .status("ACTIVE")
                .deadline(LocalDate.now().plusDays(7))
                .build()));

        Application savedApplication = applicationService.applyForJob(
                student.getId(), job.getId(), "Interested in this role");
        assertEquals(student.getId(), savedApplication.getStudent().getId());
        assertEquals(job.getId(), savedApplication.getJob().getId());
        assertEquals(company.getId(), savedApplication.getJob().getCompany().getId());

        List<CompanyApplicationDto> apps = applicationService.getCompanyApplicationsForUser(email);

        assertFalse(apps.isEmpty(), "Company apps should not be empty for the authenticated company");
        CompanyApplicationDto app = apps.get(0);
        assertEquals(company.getId(), app.getCompanyId());
        assertEquals(student.getId(), app.getStudentId());
        assertEquals(job.getId(), app.getJobId());
        assertEquals("Jane Candidate", app.getStudentName());
        assertEquals("Test Software Engineer", app.getJobTitle());
        assertEquals("APPLIED", app.getStatus());
        assertNotNull(app.getAppliedAt());
        assertEquals(student.getCgpa(), app.getCgpa());
        assertEquals(student.getResumeUrl(), app.getResumeUrl());

        String otherCompanyEmail = "other.company.flow.test." + System.currentTimeMillis() + "@example.com";
        User otherCompanyUser = userRepository.save(Objects.requireNonNull(User.builder()
                .email(otherCompanyEmail)
                .password("pw")
                .fullName("Other Recruiter")
                .role(Role.COMPANY)
                .active(true)
                .build()));
        companyProfileRepository.save(Objects.requireNonNull(CompanyProfile.builder()
                .user(otherCompanyUser)
                .companyName("Other Test Company")
                .isApproved(true)
                .build()));

        assertTrue(applicationService.getCompanyApplicationsForUser(otherCompanyEmail).isEmpty(),
                "A different company must not see this company's applications");
        assertThrows(AccessDeniedException.class,
                () -> applicationService.getCompanyApplicationsForCompany(company.getId(), otherCompanyEmail));
        assertThrows(AccessDeniedException.class,
                () -> applicationService.getApplicationByIdForUser(savedApplication.getId(), otherCompanyEmail));
        assertThrows(AccessDeniedException.class,
                () -> applicationService.assertCompanyApplicationAccess(savedApplication.getId(), otherCompanyEmail));
    }

    @Test
    void studentCanApplyAndFetchOwnApplicationsWithoutSendingProfileId() {
        String email = "student.me.flow." + System.currentTimeMillis() + "@example.com";
        User studentUser = userRepository.save(Objects.requireNonNull(User.builder()
                .email(email)
                .password("pw")
                .fullName("Self Service Candidate")
                .role(Role.STUDENT)
                .active(true)
                .build()));

        StudentProfile student = studentProfileRepository.save(Objects.requireNonNull(StudentProfile.builder()
                .user(studentUser)
                .rollNumber("SELFROLL" + System.currentTimeMillis())
                .enrollmentNumber("SELFENR" + System.currentTimeMillis())
                .cgpa(8.7)
                .build()));

        String companyEmail = "company.me.flow." + System.currentTimeMillis() + "@example.com";
        User companyUser = userRepository.save(Objects.requireNonNull(User.builder()
                .email(companyEmail)
                .password("pw")
                .fullName("Self Service Recruiter")
                .role(Role.COMPANY)
                .active(true)
                .build()));
        CompanyProfile company = companyProfileRepository.save(Objects.requireNonNull(CompanyProfile.builder()
                .user(companyUser)
                .companyName("Self Service Company")
                .isApproved(true)
                .build()));
        Job job = jobRepository.save(Objects.requireNonNull(Job.builder()
                .company(company)
                .title("Authenticated Apply Engineer")
                .status("ACTIVE")
                .deadline(LocalDate.now().plusDays(7))
                .build()));

        Application application = applicationService.applyForJobForUser(email, job.getId(), "Apply from authenticated flow");

        assertEquals(student.getId(), application.getStudent().getId());
        assertEquals(job.getId(), application.getJob().getId());
        List<Long> studentApplicationIds = new java.util.ArrayList<>();
        for (Application studentApplication : applicationService.getStudentApplicationsForUser(email)) {
            studentApplicationIds.add(Objects.requireNonNull(studentApplication.getId()));
        }
        assertEquals(List.of(application.getId()), studentApplicationIds);
        assertEquals(1, applicationService.getCompanyApplicationsForUser(companyEmail).size());
    }

    @Test
    void companyUserCanFetchCompanyApplicationsWhenEmailCaseDiffers() {
        String email = "Recruiter.Case.Test." + System.currentTimeMillis() + "@Example.com";
        User companyUser = userRepository.save(Objects.requireNonNull(User.builder()
                .email(email)
                .password("pw")
                .fullName("Mixed Case Recruiter")
                .role(Role.COMPANY)
                .active(true)
                .build()));

        CompanyProfile company = companyProfileRepository.save(Objects.requireNonNull(CompanyProfile.builder()
                .user(companyUser)
                .companyName("Case Sensitive Company")
                .isApproved(true)
                .build()));

        User studentUser = userRepository.save(Objects.requireNonNull(User.builder()
                .email("student.case.test." + System.currentTimeMillis() + "@example.com")
                .password("pw")
                .fullName("Case Candidate")
                .role(Role.STUDENT)
                .active(true)
                .build()));

        StudentProfile student = studentProfileRepository.save(Objects.requireNonNull(StudentProfile.builder()
                .user(studentUser)
                .rollNumber("CASEROLL" + System.currentTimeMillis())
                .enrollmentNumber("CASEENR" + System.currentTimeMillis())
                .cgpa(8.8)
                .build()));

        Job job = jobRepository.save(Objects.requireNonNull(Job.builder()
                .company(company)
                .title("Case Test Engineer")
                .description("Role for case-insensitive email lookup")
                .status("ACTIVE")
                .deadline(LocalDate.now().plusDays(10))
                .build()));

        applicationRepository.save(Objects.requireNonNull(Application.builder()
                .student(student)
                .job(job)
                .status("APPLIED")
                .coverNote("Applied for case-insensitive email resolution")
                .build()));

        List<CompanyApplicationDto> apps = applicationService.getCompanyApplicationsForUser(email.toLowerCase());

        assertFalse(apps.isEmpty(), "Applications should still load even if the auth email casing differs from the stored company profile email");
        assertEquals("Case Test Engineer", apps.get(0).getJobTitle());
    }
}
