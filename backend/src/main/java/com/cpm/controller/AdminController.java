package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.entity.*;
import com.cpm.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllUsers()));
    }

    @PatchMapping("/users/{userId}/toggle")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(@PathVariable Long userId) {
        User updated = adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.ok("User status updated", updated));
    }

    @PostMapping("/departments")
    public ResponseEntity<ApiResponse<Department>> createDepartment(@RequestBody Department dept) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.createDepartment(dept)));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllDepartments()));
    }

    @PostMapping("/departments/{deptId}/courses")
    public ResponseEntity<ApiResponse<Course>> createCourse(@PathVariable Long deptId, @RequestBody Course course) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.createCourse(deptId, course)));
    }

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<Course>>> getCourses() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllCourses()));
    }

    @PostMapping("/batches")
    public ResponseEntity<ApiResponse<Batch>> createBatch(@RequestParam(required = false) Long deptId, @RequestBody Batch batch) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.createBatch(deptId, batch)));
    }

    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<Batch>>> getBatches() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllBatches()));
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkills() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllSkills()));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<Skill>> createSkill(@RequestBody Skill skill) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.createSkill(skill)));
    }
}
