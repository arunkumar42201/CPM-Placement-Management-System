package com.cpm.dto;

import com.cpm.entity.StudentTask;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskSummaryDto {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private double completionRate;

    private List<StudentTask> dailyTasks;
    private List<StudentTask> weeklyTasks;
    private Map<String, Long> categoryBreakdown;
    private Map<String, Long> priorityBreakdown;
}
