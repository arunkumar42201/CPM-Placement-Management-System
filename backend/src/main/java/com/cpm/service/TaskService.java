package com.cpm.service;

import com.cpm.dto.TaskSummaryDto;
import com.cpm.entity.StudentProfile;
import com.cpm.entity.StudentTask;
import com.cpm.repository.StudentProfileRepository;
import com.cpm.repository.StudentTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class TaskService {

    @Autowired
    private StudentTaskRepository studentTaskRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    public List<StudentTask> getStudentTasks(Long studentId) {
        return studentTaskRepository.findByStudentIdOrderByDueDateAsc(studentId);
    }

    public List<StudentTask> getDailyTasks(Long studentId, LocalDate date) {
        return studentTaskRepository.findDailyTasks(studentId, date != null ? date : LocalDate.now());
    }

    @Transactional
    public StudentTask createTask(Long studentId, StudentTask task) {
        StudentProfile student = studentProfileRepository.findById(Objects.requireNonNull(studentId))
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        task.setStudent(student);
        if (task.getDueDate() == null) {
            task.setDueDate(LocalDate.now());
        }
        if (task.getCategory() == null) {
            task.setCategory("CODING");
        }
        if (task.getPriority() == null) {
            task.setPriority("MEDIUM");
        }
        task.setCompleted(false);

        return studentTaskRepository.save(Objects.requireNonNull(task));
    }

    @Transactional
    public StudentTask updateTask(Long taskId, StudentTask updated) {
        StudentTask task = studentTaskRepository.findById(Objects.requireNonNull(taskId))
                .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));

        if (updated.getTitle() != null) task.setTitle(updated.getTitle());
        if (updated.getDescription() != null) task.setDescription(updated.getDescription());
        if (updated.getCategory() != null) task.setCategory(updated.getCategory());
        if (updated.getPriority() != null) task.setPriority(updated.getPriority());
        if (updated.getDueDate() != null) task.setDueDate(updated.getDueDate());
        if (updated.getCompleted() != null) {
            task.setCompleted(updated.getCompleted());
            task.setCompletedAt(updated.getCompleted() ? LocalDateTime.now() : null);
        }

        return studentTaskRepository.save(Objects.requireNonNull(task));
    }

    @Transactional
    public StudentTask toggleTaskCompletion(Long taskId) {
        StudentTask task = studentTaskRepository.findById(Objects.requireNonNull(taskId))
                .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));

        boolean newStatus = !Boolean.TRUE.equals(task.getCompleted());
        task.setCompleted(newStatus);
        task.setCompletedAt(newStatus ? LocalDateTime.now() : null);

        return studentTaskRepository.save(Objects.requireNonNull(task));
    }

    @Transactional
    public void deleteTask(Long taskId) {
        studentTaskRepository.deleteById(Objects.requireNonNull(taskId));
    }

    public TaskSummaryDto getTaskSummary(Long studentId) {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);
        List<StudentTask> allTasks = studentTaskRepository.findByStudentIdOrderByDueDateAsc(studentId);
        List<StudentTask> dailyTasks = studentTaskRepository.findDailyTasks(studentId, today);
        List<StudentTask> weeklyTasks = studentTaskRepository.findTasksBetweenDates(studentId, weekAgo, today.plusDays(7));

        long total = allTasks.size();
        long completed = allTasks.stream().filter(t -> Boolean.TRUE.equals(t.getCompleted())).count();
        long pending = total - completed;
        double rate = total > 0 ? ((double) completed / total) * 100.0 : 0.0;

        Map<String, Long> categoryBreakdown = new HashMap<>();
        Map<String, Long> priorityBreakdown = new HashMap<>();

        for (StudentTask t : allTasks) {
            String cat = t.getCategory() != null ? t.getCategory() : "OTHER";
            categoryBreakdown.put(cat, categoryBreakdown.getOrDefault(cat, 0L) + 1);

            String pri = t.getPriority() != null ? t.getPriority() : "MEDIUM";
            priorityBreakdown.put(pri, priorityBreakdown.getOrDefault(pri, 0L) + 1);
        }

        return TaskSummaryDto.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .pendingTasks(pending)
                .completionRate(Math.round(rate * 10.0) / 10.0)
                .dailyTasks(dailyTasks)
                .weeklyTasks(weeklyTasks)
                .categoryBreakdown(categoryBreakdown)
                .priorityBreakdown(priorityBreakdown)
                .build();
    }
}
