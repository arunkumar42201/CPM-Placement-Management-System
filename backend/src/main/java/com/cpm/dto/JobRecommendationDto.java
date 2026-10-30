package com.cpm.dto;

import com.cpm.entity.Job;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRecommendationDto {
    private Job job;
    private int matchPercentage;
    private boolean isEligible;
    private List<String> matchingReasons;
    private List<String> matchedSkills;
    private List<String> missingSkills;
}
