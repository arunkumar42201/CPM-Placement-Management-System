package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.entity.Job;
import com.cpm.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Job>>> getAllJobs(@RequestParam(required = false) String status) {
        if ("ACTIVE".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(ApiResponse.ok(jobService.getActiveJobs()));
        }
        return ResponseEntity.ok(ApiResponse.ok(jobService.getAllJobs()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getJobById(id)));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<List<Job>>> getCompanyJobs(@PathVariable Long companyId) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getCompanyJobs(companyId)));
    }

    @PostMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<Job>> createJob(@PathVariable Long companyId,
                                                      @RequestParam(required = false) Long driveId,
                                                      @RequestBody Job job) {
        Job saved = jobService.createJob(companyId, job, driveId);
        return ResponseEntity.ok(ApiResponse.ok("Job posted successfully", saved));
    }

    @PatchMapping("/{id}/approval")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Job>> approveJob(@PathVariable Long id,
                                                       @RequestBody Map<String, Boolean> body) {
        Job updated = jobService.approveJob(id, body.getOrDefault("approve", true));
        return ResponseEntity.ok(ApiResponse.ok(updated.getStatus().equals("ACTIVE")
                ? "Job approved successfully" : "Job rejected", updated));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> updateJob(@PathVariable Long id, @RequestBody Job job) {
        Job updated = jobService.updateJob(id, job);
        return ResponseEntity.ok(ApiResponse.ok("Job updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.ok("Job deleted", null));
    }
}
