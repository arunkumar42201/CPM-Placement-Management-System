package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.dto.CandidateMatchDto;
import com.cpm.entity.Job;
import com.cpm.entity.StudentProfile;
import com.cpm.service.CandidateMatchingService;
import com.cpm.service.JobService;
import com.cpm.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@PreAuthorize("hasAnyRole('COMPANY', 'RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
public class CandidateMatchingController {

    @Autowired
    private CandidateMatchingService candidateMatchingService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private JobService jobService;

    @GetMapping("/match/{jobId}")
    public ResponseEntity<ApiResponse<List<CandidateMatchDto>>> matchCandidatesForJob(@PathVariable Long jobId) {
        List<CandidateMatchDto> matches = candidateMatchingService.matchCandidatesForJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok("Candidate matching calculated successfully", matches));
    }

    @GetMapping("/match/{jobId}/student/{studentId}")
    public ResponseEntity<ApiResponse<CandidateMatchDto>> matchSingleCandidate(@PathVariable Long jobId, @PathVariable Long studentId) {
        StudentProfile student = studentService.getProfileById(studentId);
        Job job = jobService.getJobById(jobId);
        CandidateMatchDto match = candidateMatchingService.matchCandidate(student, job);
        return ResponseEntity.ok(ApiResponse.ok("Match details calculated", match));
    }
}
