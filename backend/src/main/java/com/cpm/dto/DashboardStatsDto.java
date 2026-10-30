package com.cpm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    // Placement & Global Stats
    private long totalStudents;
    private long eligibleStudents;
    private long placedStudents;
    private double placementPercentage;
    private Double highestPackage;
    private Double averagePackage;
    private long totalCompanies;
    private long activeDrives;
    private long totalJobs;
    private long totalApplications;
    private long totalInterviews;

    // Student personal stats (when requested by student)
    private Integer profileCompletionPercentage;
    private long studentAppliedCount;
    private long studentShortlistedCount;
    private long studentInterviewsCount;
    private long studentOffersCount;
    private long studentTasksCompleted;
    private long studentTasksPending;

    // Charts & breakdowns
    private Map<String, Long> departmentPlacements;
    private Map<String, Double> packageRanges;
    private Map<String, Long> skillDemands;
}
