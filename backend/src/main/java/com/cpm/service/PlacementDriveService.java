package com.cpm.service;

import com.cpm.entity.CompanyProfile;
import com.cpm.entity.PlacementDrive;
import com.cpm.repository.CompanyProfileRepository;
import com.cpm.repository.PlacementDriveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class PlacementDriveService {

    @Autowired
    private PlacementDriveRepository placementDriveRepository;

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    public List<PlacementDrive> getAllDrives() {
        return placementDriveRepository.findAll();
    }

    public List<PlacementDrive> getDrivesByStatus(String status) {
        return placementDriveRepository.findByStatus(status);
    }

    public PlacementDrive getDriveById(Long id) {
        return placementDriveRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Placement drive not found: " + id));
    }

    @Transactional
    public PlacementDrive createDrive(Long companyId, PlacementDrive drive) {
        CompanyProfile company = companyProfileRepository.findById(Objects.requireNonNull(companyId))
                .orElseThrow(() -> new RuntimeException("Company not found: " + companyId));

        if (Boolean.FALSE.equals(company.getIsApproved())) {
            throw new RuntimeException("Company profile is pending approval. You cannot create placement drives until approved by the administration.");
        }

        drive.setCompany(company);
        if (drive.getStatus() == null) {
            drive.setStatus("UPCOMING");
        }
        return placementDriveRepository.save(Objects.requireNonNull(drive));
    }

    @Transactional
    public PlacementDrive updateDrive(Long id, PlacementDrive updated) {
        PlacementDrive existing = getDriveById(id);
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getStartDate() != null) existing.setStartDate(updated.getStartDate());
        if (updated.getEndDate() != null) existing.setEndDate(updated.getEndDate());
        if (updated.getRegistrationDeadline() != null) existing.setRegistrationDeadline(updated.getRegistrationDeadline());
        if (updated.getVenue() != null) existing.setVenue(updated.getVenue());
        if (updated.getMinCgpa() != null) existing.setMinCgpa(updated.getMinCgpa());
        if (updated.getEligibleBranches() != null) existing.setEligibleBranches(updated.getEligibleBranches());
        if (updated.getMaxBacklogs() != null) existing.setMaxBacklogs(updated.getMaxBacklogs());
        if (updated.getRounds() != null) existing.setRounds(updated.getRounds());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        return placementDriveRepository.save(Objects.requireNonNull(existing));
    }

    @Transactional
    public void deleteDrive(Long id) {
        placementDriveRepository.deleteById(Objects.requireNonNull(id));
    }
}
