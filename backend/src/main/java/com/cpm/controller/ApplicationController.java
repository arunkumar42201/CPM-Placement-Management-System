package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.dto.CompanyApplicationDto;
import com.cpm.entity.Application;
import com.cpm.entity.Interview;
import com.cpm.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<Application>> apply(
            @RequestBody Map<String, Object> body, Authentication authentication) {
        Long jobId = Long.valueOf(body.get("jobId").toString());
        String coverNote = body.get("coverNote") != null ? body.get("coverNote").toString() : "";
        Application app = applicationService.applyForJobForUser(authentication.getName(), jobId, coverNote);
        return ResponseEntity.ok(ApiResponse.ok("Application submitted successfully", app));
    }

    @GetMapping("/student/me")
    public ResponseEntity<ApiResponse<List<Application>>> getMyStudentApplications(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(
                applicationService.getStudentApplicationsForUser(authentication.getName())));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Application>>> getStudentApplications(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getStudentApplications(studentId)));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<Application>>> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getJobApplications(jobId)));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<List<CompanyApplicationDto>>> getCompanyApplications(
            @PathVariable Long companyId, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(
                applicationService.getCompanyApplicationsForCompany(companyId, authentication.getName())));
    }

    @GetMapping("/company")
    public ResponseEntity<ApiResponse<List<CompanyApplicationDto>>> getCompanyApplicationsForAuthenticatedCompany(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getCompanyApplicationsForUser(authentication.getName())));
    }

    @GetMapping("/company/me")
    public ResponseEntity<ApiResponse<List<CompanyApplicationDto>>> getMyCompanyApplications(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getCompanyApplicationsForUser(authentication.getName())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Application>> getApplicationById(
            @PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(
                applicationService.getApplicationByIdForUser(id, authentication.getName())));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Application>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        applicationService.assertCompanyApplicationAccess(id, authentication.getName());
        String status = body.get("status");
        String feedback = body.get("feedback");
        Application updated = applicationService.updateApplicationStatus(id, status, feedback);
        return ResponseEntity.ok(ApiResponse.ok("Status updated to " + status, updated));
    }

    @PostMapping("/{id}/interviews")
    public ResponseEntity<ApiResponse<Interview>> scheduleInterview(
            @PathVariable Long id, @RequestBody Interview interview, Authentication authentication) {
        applicationService.assertCompanyApplicationAccess(id, authentication.getName());
        Interview scheduled = applicationService.scheduleInterview(id, interview);
        return ResponseEntity.ok(ApiResponse.ok("Interview scheduled successfully", scheduled));
    }

    @GetMapping("/student/{studentId}/interviews")
    public ResponseEntity<ApiResponse<List<Interview>>> getStudentInterviews(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getStudentInterviews(studentId)));
    }

    @GetMapping("/company/{companyId}/interviews")
    public ResponseEntity<ApiResponse<List<Interview>>> getCompanyInterviews(@PathVariable Long companyId) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getCompanyInterviews(companyId)));
    }
}
