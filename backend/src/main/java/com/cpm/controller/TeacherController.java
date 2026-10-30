package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.entity.*;
import com.cpm.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<TeacherProfile>> getTeacherByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getProfileByUserId(userId)));
    }

    @GetMapping("/department/{departmentId}/students")
    public ResponseEntity<ApiResponse<List<StudentProfile>>> getDepartmentStudents(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getDepartmentStudents(departmentId)));
    }

    @PostMapping("/{teacherId}/attendance")
    public ResponseEntity<ApiResponse<Attendance>> recordAttendance(
            @PathVariable Long teacherId,
            @RequestBody Map<String, Object> body) {
        Long studentId = Long.valueOf(body.get("studentId").toString());
        Long courseId = body.get("courseId") != null ? Long.valueOf(body.get("courseId").toString()) : null;
        String subjectName = body.get("subjectName") != null ? body.get("subjectName").toString() : "General";
        LocalDate date = body.get("date") != null ? LocalDate.parse(body.get("date").toString()) : LocalDate.now();
        String status = body.get("status") != null ? body.get("status").toString() : "PRESENT";

        Attendance record = teacherService.recordAttendance(teacherId, studentId, courseId, subjectName, date, status);
        return ResponseEntity.ok(ApiResponse.ok("Attendance recorded", record));
    }

    @GetMapping("/student/{studentId}/attendance")
    public ResponseEntity<ApiResponse<List<Attendance>>> getStudentAttendance(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getStudentAttendance(studentId)));
    }

    @PostMapping("/{teacherId}/assignments")
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(
            @PathVariable Long teacherId,
            @RequestBody Assignment assignment) {
        Assignment saved = teacherService.createAssignment(teacherId, assignment);
        return ResponseEntity.ok(ApiResponse.ok("Assignment posted successfully", saved));
    }

    @GetMapping("/{teacherId}/assignments")
    public ResponseEntity<ApiResponse<List<Assignment>>> getTeacherAssignments(@PathVariable Long teacherId) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getTeacherAssignments(teacherId)));
    }

    @GetMapping("/assignments/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<Assignment>>> getDepartmentAssignments(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getDepartmentAssignments(departmentId)));
    }

    @PostMapping("/assignments/{assignmentId}/submit/{studentId}")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> submitAssignment(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId,
            @RequestBody Map<String, String> body) {
        String fileUrl = body.get("fileUrl");
        String comments = body.get("comments");
        AssignmentSubmission sub = teacherService.submitAssignment(studentId, assignmentId, fileUrl, comments);
        return ResponseEntity.ok(ApiResponse.ok("Assignment submitted successfully", sub));
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<ApiResponse<List<AssignmentSubmission>>> getAssignmentSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getAssignmentSubmissions(assignmentId)));
    }

    @GetMapping("/student/{studentId}/submissions")
    public ResponseEntity<ApiResponse<List<AssignmentSubmission>>> getStudentSubmissions(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getStudentSubmissions(studentId)));
    }

    @PatchMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestBody Map<String, Object> body) {
        Integer marks = Integer.valueOf(body.get("marks").toString());
        String feedback = body.get("feedback") != null ? body.get("feedback").toString() : "";
        AssignmentSubmission graded = teacherService.gradeSubmission(submissionId, marks, feedback);
        return ResponseEntity.ok(ApiResponse.ok("Submission graded successfully", graded));
    }

    @PostMapping("/{teacherId}/study-materials")
    public ResponseEntity<ApiResponse<StudyMaterial>> uploadStudyMaterial(
            @PathVariable Long teacherId,
            @RequestBody StudyMaterial material) {
        StudyMaterial saved = teacherService.uploadStudyMaterial(teacherId, material);
        return ResponseEntity.ok(ApiResponse.ok("Study material shared", saved));
    }

    @GetMapping("/study-materials")
    public ResponseEntity<ApiResponse<List<StudyMaterial>>> getAllStudyMaterials() {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getAllStudyMaterials()));
    }
}
