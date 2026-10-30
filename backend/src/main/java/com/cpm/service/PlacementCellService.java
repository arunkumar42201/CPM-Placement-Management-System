package com.cpm.service;

import com.cpm.entity.*;
import com.cpm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class PlacementCellService {

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private PlacementResultRepository placementResultRepository;

    @Autowired
    private NotificationService notificationService;

    public List<CompanyProfile> getAllCompanies() {
        return companyProfileRepository.findAll();
    }

    public List<CompanyProfile> getApprovedCompanies() {
        return companyProfileRepository.findByIsApprovedTrue();
    }

    public List<CompanyProfile> getPendingCompanies() {
        return companyProfileRepository.findByIsApprovedFalse();
    }

    @Transactional
    public CompanyProfile approveCompany(Long companyId, boolean approve) {
        CompanyProfile company = companyProfileRepository.findById(Objects.requireNonNull(companyId))
                .orElseThrow(() -> new RuntimeException("Company not found: " + companyId));
        company.setIsApproved(approve);
        CompanyProfile saved = companyProfileRepository.save(Objects.requireNonNull(company));

        if (company.getUser() != null) {
            notificationService.createNotification(
                    company.getUser(),
                    approve ? "Company Profile Approved" : "Company Profile Status Update",
                    approve ? "Your company profile has been approved! You can now post jobs and schedule placement drives."
                            : "Your company verification is pending review.",
                    "SYSTEM",
                    "/company/dashboard"
            );
        }

        return saved;
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    public List<PlacementResult> getAllPlacementResults() {
        return placementResultRepository.findAll();
    }
}
