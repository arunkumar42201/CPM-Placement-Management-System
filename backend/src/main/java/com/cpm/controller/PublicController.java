package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.dto.DashboardStatsDto;
import com.cpm.entity.CompanyProfile;
import com.cpm.entity.Department;
import com.cpm.entity.Job;
import com.cpm.entity.PlacementDrive;
import com.cpm.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private PlacementCellService placementCellService;

    @Autowired
    private JobService jobService;

    @Autowired
    private PlacementDriveService placementDriveService;

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getPublicStats() {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getGlobalDashboardStats(null)));
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<CompanyProfile>>> getTopCompanies() {
        return ResponseEntity.ok(ApiResponse.ok(placementCellService.getApprovedCompanies()));
    }

    @GetMapping("/featured-jobs")
    public ResponseEntity<ApiResponse<List<Job>>> getFeaturedJobs() {
        List<Job> active = jobService.getActiveJobs();
        return ResponseEntity.ok(ApiResponse.ok(active.size() > 6 ? active.subList(0, 6) : active));
    }

    @GetMapping("/upcoming-drives")
    public ResponseEntity<ApiResponse<List<PlacementDrive>>> getUpcomingDrives() {
        return ResponseEntity.ok(ApiResponse.ok(placementDriveService.getAllDrives()));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllDepartments()));
    }

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<Map<String, String>>> handleContactForm(@RequestBody Map<String, String> body) {
        Map<String, String> res = new HashMap<>();
        res.put("status", "RECEIVED");
        res.put("message", "Thank you " + body.getOrDefault("name", "Student") + "! Our placement team will reach out to you shortly.");
        return ResponseEntity.ok(ApiResponse.ok(res));
    }
}
