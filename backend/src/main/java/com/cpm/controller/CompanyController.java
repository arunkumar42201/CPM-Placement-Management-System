package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.entity.CompanyProfile;
import com.cpm.entity.User;
import com.cpm.service.AuthService;
import com.cpm.service.CompanyProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/company", "/company"})
public class CompanyController {

    @Autowired
    private AuthService authService;

    @Autowired
    private CompanyProfileService companyProfileService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CompanyProfile>> getMyProfile() {
        User currentUser = authService.getCurrentUser();
        CompanyProfile profile = companyProfileService.getMyProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CompanyProfile>> updateMyProfile(@RequestBody CompanyProfile profile) {
        User currentUser = authService.getCurrentUser();
        CompanyProfile saved = companyProfileService.updateMyProfile(currentUser, profile);
        return ResponseEntity.ok(ApiResponse.ok("Company profile saved successfully", saved));
    }
}
