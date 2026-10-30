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
public class MockInterviewEvaluateResponse {
    private int technicalScore; // 1-10
    private int clarityScore; // 1-10
    private int structureScore; // 1-10
    private int overallScore; // 1-10
    private String feedbackSummary;
    private List<String> keyStrengths;
    private List<String> improvementAreas;
    private String modelIdealAnswerSnippet;
}
