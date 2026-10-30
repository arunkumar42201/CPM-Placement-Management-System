package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.dto.DashboardStatsDto;
import com.cpm.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats(
            @RequestParam(required = false) Long studentId) {
        DashboardStatsDto stats = analyticsService.getGlobalDashboardStats(studentId);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
