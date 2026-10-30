package com.cpm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyApplicationDto {
    private Long id;
    private Long applicationId;
    private Long companyId;
    private Long studentId;
    private String studentName;
    private String email;
    private String studentEmail;
    private Long jobId;
    private String jobTitle;
    private String status;
    private LocalDateTime appliedAt;
    private String coverNote;
    private String recruiterFeedback;
    private Double cgpa;
    private String phone;
    private String resumeUrl;
    private List<String> skills;
    private List<String> internships;
}
