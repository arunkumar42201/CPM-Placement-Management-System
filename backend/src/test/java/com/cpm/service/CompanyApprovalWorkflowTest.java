package com.cpm.service;

import com.cpm.entity.CompanyProfile;
import com.cpm.entity.Job;
import com.cpm.entity.PlacementDrive;
import com.cpm.entity.User;
import com.cpm.repository.CompanyProfileRepository;
import com.cpm.repository.JobRepository;
import com.cpm.repository.PlacementDriveRepository;
import com.cpm.repository.StudentProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CompanyApprovalWorkflowTest {

    @Mock
    private CompanyProfileRepository companyProfileRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private PlacementDriveRepository placementDriveRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private JobService jobService;

    @InjectMocks
    private PlacementDriveService placementDriveService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void unapprovedCompanyCanSubmitJobForAdminApproval() {
        CompanyProfile unapprovedCompany = CompanyProfile.builder()
                .id(100L)
                .companyName("Pending Tech Corp")
                .isApproved(false)
                .build();

        when(companyProfileRepository.findById(100L)).thenReturn(Optional.of(unapprovedCompany));

        Job job = Job.builder().title("Software Engineer").build();
        when(jobRepository.save(Objects.requireNonNull(job))).thenReturn(job);

        Job saved = jobService.createJob(100L, job, null);

        assertSame(job, saved);
        assertEquals(unapprovedCompany, saved.getCompany());
        assertEquals("PENDING", saved.getStatus());
        verify(jobRepository).save(Objects.requireNonNull(job));
    }

    @Test
    void adminCannotActivateJobUntilCompanyIsApproved() {
        CompanyProfile unapprovedCompany = CompanyProfile.builder()
                .id(104L)
                .companyName("Pending Tech Corp")
                .isApproved(false)
                .build();
        Job job = Job.builder().id(10L).title("Software Engineer")
                .company(unapprovedCompany).status("PENDING").build();
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> jobService.approveJob(10L, true));

        assertTrue(exception.getMessage().contains("Company profile must be approved"));
        verify(jobRepository, never()).save(Objects.requireNonNull(job));
    }

    @Test
    void adminCanApprovePendingJob() {
        User recruiter = User.builder().id(1L).email("recruiter@demo.com").build();
        CompanyProfile company = CompanyProfile.builder()
                .id(103L)
                .companyName("Pending Approval Tech")
                .user(recruiter)
                .isApproved(true)
                .build();
        Job job = Job.builder().id(9L).title("Frontend Engineer").company(company).status("PENDING").build();

        when(jobRepository.findById(9L)).thenReturn(Optional.of(job));
        when(jobRepository.save(Objects.requireNonNull(job))).thenReturn(job);
        when(studentProfileRepository.findAll()).thenReturn(java.util.Collections.emptyList());

        Job approved = jobService.approveJob(9L, true);

        assertEquals("ACTIVE", approved.getStatus());
        verify(jobRepository).save(Objects.requireNonNull(job));
        verify(notificationService).createNotification(eq(recruiter), anyString(), anyString(), eq("JOB"), eq("/company/jobs"));
    }

    @Test
    void unapprovedCompanyCannotCreatePlacementDrive() {
        CompanyProfile unapprovedCompany = CompanyProfile.builder()
                .id(101L)
                .companyName("Pending Solutions")
                .isApproved(false)
                .build();

        when(companyProfileRepository.findById(101L)).thenReturn(Optional.of(unapprovedCompany));

        PlacementDrive drive = PlacementDrive.builder().title("Campus Drive 2026").build();

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            placementDriveService.createDrive(101L, drive);
        });

        assertTrue(exception.getMessage().contains("pending approval"));
        verify(placementDriveRepository, never()).save(Objects.requireNonNull(drive));
    }

    @Test
    void approvedCompanyCanCreateJob() {
        CompanyProfile approvedCompany = CompanyProfile.builder()
                .id(102L)
                .companyName("Approved Tech Corp")
                .isApproved(true)
                .build();

        Job job = Job.builder().title("Full Stack Engineer").build();

        when(companyProfileRepository.findById(102L)).thenReturn(Optional.of(approvedCompany));
        when(jobRepository.save(Objects.requireNonNull(job))).thenReturn(job);

        Job saved = jobService.createJob(102L, job, null);

        assertNotNull(saved);
        assertEquals(approvedCompany, saved.getCompany());
        assertEquals("PENDING", saved.getStatus());
        verify(jobRepository, times(1)).save(Objects.requireNonNull(job));
    }
}
