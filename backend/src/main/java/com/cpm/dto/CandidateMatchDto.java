package com.cpm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateMatchDto {
    private Long studentId;
    private String fullName;
    private String email;
    private String rollNumber;
    private String departmentName;
    private Double cgpa;
    private Integer activeBacklogs;
    private String resumeUrl;

    private int overallMatchPercentage; // 0 - 100%
    private boolean isEligible;
    private List<String> eligibilityNotes;

    // Breakdown
    private int skillsScore; // out of 40
    private int academicsScore; // out of 25
    private int projectsScore; // out of 20
    private int certificationsScore; // out of 15

    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> studentProjects;
}
