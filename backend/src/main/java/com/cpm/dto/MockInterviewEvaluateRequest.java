package com.cpm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MockInterviewEvaluateRequest {
    private String roleCategory; // e.g. "Software Engineer", "Frontend Developer", "Data Scientist"
    private String roundType; // "TECHNICAL", "SYSTEM_DESIGN", "DSA", "BEHAVIORAL"
    private String question;
    private String answer;
}
