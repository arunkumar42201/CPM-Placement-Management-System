package com.cpm.service;

import com.cpm.entity.CompanyProfile;
import com.cpm.entity.User;
import com.cpm.repository.CompanyProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class CompanyProfileService {

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    public CompanyProfile getMyProfile(User user) {
        Objects.requireNonNull(user, "User is required");

        CompanyProfile existingProfile = findProfileForUser(user);
        if (existingProfile != null) {
            return existingProfile;
        }

        CompanyProfile profile = CompanyProfile.builder()
                .user(user)
                .companyName(user.getFullName())
                .industry("Technology")
                .description("")
                .location("")
                .website("")
                .contactPerson(user.getFullName())
                .contactPhone(user.getPhone())
                .isApproved(false)
                .build();
        return companyProfileRepository.save(Objects.requireNonNull(profile));
    }

    public CompanyProfile updateMyProfile(User user, CompanyProfile incoming) {
        Objects.requireNonNull(user, "User is required");
        Objects.requireNonNull(incoming, "Profile data is required");

        CompanyProfile profile = findProfileForUser(user);
        if (profile == null) {
            profile = CompanyProfile.builder().user(user).isApproved(false).build();
        }

        if (incoming.getCompanyName() != null) profile.setCompanyName(incoming.getCompanyName());
        if (incoming.getIndustry() != null) profile.setIndustry(incoming.getIndustry());
        if (incoming.getWebsite() != null) profile.setWebsite(incoming.getWebsite());
        if (incoming.getLocation() != null) profile.setLocation(incoming.getLocation());
        if (incoming.getDescription() != null) profile.setDescription(incoming.getDescription());
        if (incoming.getContactPerson() != null) profile.setContactPerson(incoming.getContactPerson());
        if (incoming.getContactPhone() != null) profile.setContactPhone(incoming.getContactPhone());
        if (incoming.getLogoUrl() != null) profile.setLogoUrl(incoming.getLogoUrl());
        if (incoming.getRecruiterDesignation() != null) profile.setRecruiterDesignation(incoming.getRecruiterDesignation());
        if (profile.getUser() == null) profile.setUser(user);

        if (profile.getCompanyName() == null || profile.getCompanyName().isBlank()) {
            profile.setCompanyName(user.getFullName());
        }
        if (profile.getContactPerson() == null || profile.getContactPerson().isBlank()) {
            profile.setContactPerson(user.getFullName());
        }
        if (profile.getContactPhone() == null || profile.getContactPhone().isBlank()) {
            profile.setContactPhone(user.getPhone());
        }

        return companyProfileRepository.save(profile);
    }

    private CompanyProfile findProfileForUser(User user) {
        return companyProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> companyProfileRepository.findAll().stream()
                        .filter(profile -> profile.getUser() != null
                                && Objects.equals(profile.getUser().getId(), user.getId()))
                        .findFirst()
                        .orElse(null));
    }
}
