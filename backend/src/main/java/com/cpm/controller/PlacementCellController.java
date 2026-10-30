package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.entity.Application;
import com.cpm.entity.CompanyProfile;
import com.cpm.entity.Interview;
import com.cpm.entity.PlacementResult;
import com.cpm.service.PlacementCellService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/placement")
public class PlacementCellController {

    @Autowired
    private PlacementCellService placementCellService;

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<CompanyProfile>>> getCompanies(@RequestParam(required = false) Boolean approved) {
        if (Boolean.TRUE.equals(approved)) {
            return ResponseEntity.ok(ApiResponse.ok(placementCellService.getApprovedCompanies()));
        } else if (Boolean.FALSE.equals(approved)) {
            return ResponseEntity.ok(ApiResponse.ok(placementCellService.getPendingCompanies()));
        }
        return ResponseEntity.ok(ApiResponse.ok(placementCellService.getAllCompanies()));
    }

    @PatchMapping("/companies/{companyId}/approve")
    public ResponseEntity<ApiResponse<CompanyProfile>> approveCompany(@PathVariable Long companyId, @RequestBody Map<String, Boolean> body) {
        boolean approve = body.getOrDefault("approve", true);
        CompanyProfile updated = placementCellService.approveCompany(companyId, approve);
        return ResponseEntity.ok(ApiResponse.ok("Company approval status updated", updated));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<Application>>> getAllApplications() {
        return ResponseEntity.ok(ApiResponse.ok(placementCellService.getAllApplications()));
    }

    @GetMapping("/interviews")
    public ResponseEntity<ApiResponse<List<Interview>>> getAllInterviews() {
        return ResponseEntity.ok(ApiResponse.ok(placementCellService.getAllInterviews()));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<PlacementResult>>> getAllPlacementResults() {
        return ResponseEntity.ok(ApiResponse.ok(placementCellService.getAllPlacementResults()));
    }
}
