package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.dto.TaskSummaryDto;
import com.cpm.entity.StudentTask;
import com.cpm.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<StudentTask>>> getStudentTasks(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(taskService.getStudentTasks(studentId)));
    }

    @GetMapping("/student/{studentId}/daily")
    public ResponseEntity<ApiResponse<List<StudentTask>>> getDailyTasks(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.ok(taskService.getDailyTasks(studentId, date)));
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<ApiResponse<TaskSummaryDto>> getTaskSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(taskService.getTaskSummary(studentId)));
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<StudentTask>> createTask(@PathVariable Long studentId, @RequestBody StudentTask task) {
        StudentTask created = taskService.createTask(studentId, task);
        return ResponseEntity.ok(ApiResponse.ok("Task created successfully", created));
    }

    @PatchMapping("/{taskId}/toggle")
    public ResponseEntity<ApiResponse<StudentTask>> toggleTask(@PathVariable Long taskId) {
        StudentTask toggled = taskService.toggleTaskCompletion(taskId);
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", toggled));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<ApiResponse<StudentTask>> updateTask(@PathVariable Long taskId, @RequestBody StudentTask task) {
        StudentTask updated = taskService.updateTask(taskId, task);
        return ResponseEntity.ok(ApiResponse.ok("Task updated successfully", updated));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok(ApiResponse.ok("Task deleted successfully", null));
    }
}
