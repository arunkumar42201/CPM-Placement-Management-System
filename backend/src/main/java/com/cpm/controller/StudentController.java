package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.dto.JobRecommendationDto;
import com.cpm.entity.*;
import com.cpm.repository.UserRepository;
import com.cpm.service.CandidateMatchingService;
import com.cpm.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private CandidateMatchingService candidateMatchingService;

    @Autowired
    private UserRepository userRepository;

    private boolean canAccessStudent(Long studentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return false;
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (currentUser == null) {
            return false;
        }

        if (currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.PLACEMENT_OFFICER) {
            return true;
        }

        StudentProfile profile = studentService.getProfileByUserId(currentUser.getId());
        return profile != null && Objects.equals(profile.getId(), studentId);
    }

    private void validateStudentAccess(Long studentId) {
        if (!canAccessStudent(studentId)) {
            throw new AccessDeniedException("You are not allowed to access this student record.");
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT_OFFICER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentProfile>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getAllStudents()));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'PLACEMENT_OFFICER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentProfile>> getStudentById(@PathVariable Long id) {
        validateStudentAccess(id);
        return ResponseEntity.ok(ApiResponse.ok(studentService.getProfileById(id)));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'PLACEMENT_OFFICER', 'ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<StudentProfile>> getStudentByUserId(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authenticatedUser = userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found."));

        StudentProfile currentStudent;
        if (authenticatedUser.getRole() == Role.STUDENT && Objects.equals(authenticatedUser.getId(), userId)) {
            currentStudent = studentService.getOrCreateProfileByUserId(userId);
        } else {
            currentStudent = studentService.getProfileByUserId(userId);
        }
        validateStudentAccess(currentStudent.getId());
        return ResponseEntity.ok(ApiResponse.ok(currentStudent));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentProfile>> updateStudentProfile(@PathVariable Long id, @RequestBody StudentProfile profile) {
        validateStudentAccess(id);
        StudentProfile updated = studentService.updateProfile(id, profile);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @PostMapping("/{id}/skills")
    public ResponseEntity<ApiResponse<StudentSkill>> addSkill(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        validateStudentAccess(id);
        Long skillId = body.get("skillId") != null ? Long.valueOf(body.get("skillId").toString()) : null;
        String skillName = body.get("skillName") != null ? body.get("skillName").toString() : null;
        String proficiency = body.get("proficiency") != null ? body.get("proficiency").toString() : "INTERMEDIATE";
        StudentSkill skill = studentService.addSkill(id, skillId, skillName, proficiency);
        return ResponseEntity.ok(ApiResponse.ok("Skill added", skill));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<ApiResponse<Void>> removeSkill(@PathVariable Long skillId) {
        studentService.removeSkill(skillId);
        return ResponseEntity.ok(ApiResponse.ok("Skill removed", null));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @PostMapping("/{id}/projects")
    public ResponseEntity<ApiResponse<Project>> addProject(@PathVariable Long id, @RequestBody Project project) {
        validateStudentAccess(id);
        Project saved = studentService.addProject(id, project);
        return ResponseEntity.ok(ApiResponse.ok("Project saved", saved));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long projectId) {
        studentService.deleteProject(projectId);
        return ResponseEntity.ok(ApiResponse.ok("Project deleted", null));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @PostMapping("/{id}/certifications")
    public ResponseEntity<ApiResponse<Certification>> addCertification(@PathVariable Long id, @RequestBody Certification certification) {
        validateStudentAccess(id);
        Certification saved = studentService.addCertification(id, certification);
        return ResponseEntity.ok(ApiResponse.ok("Certification saved", saved));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @DeleteMapping("/certifications/{certId}")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(@PathVariable Long certId) {
        studentService.deleteCertification(certId);
        return ResponseEntity.ok(ApiResponse.ok("Certification deleted", null));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @PostMapping("/{id}/internships")
    public ResponseEntity<ApiResponse<Internship>> addInternship(@PathVariable Long id, @RequestBody Internship internship) {
        validateStudentAccess(id);
        Internship saved = studentService.addInternship(id, internship);
        return ResponseEntity.ok(ApiResponse.ok("Internship saved", saved));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @DeleteMapping("/internships/{internshipId}")
    public ResponseEntity<ApiResponse<Void>> deleteInternship(@PathVariable Long internshipId) {
        studentService.deleteInternship(internshipId);
        return ResponseEntity.ok(ApiResponse.ok("Internship deleted", null));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @PostMapping("/{id}/resume")
    public ResponseEntity<ApiResponse<Resume>> saveResume(@PathVariable Long id, @RequestBody Map<String, String> body) {
        validateStudentAccess(id);
        String fileName = body.getOrDefault("fileName", "Resume.pdf");
        String fileUrl = body.getOrDefault("fileUrl", "");
        Resume resume = studentService.saveResume(id, fileName, fileUrl);
        return ResponseEntity.ok(ApiResponse.ok("Resume saved successfully", resume));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @GetMapping("/{id}/resumes")
    public ResponseEntity<ApiResponse<List<Resume>>> getResumes(@PathVariable Long id) {
        validateStudentAccess(id);
        return ResponseEntity.ok(ApiResponse.ok(studentService.getStudentResumes(id)));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @GetMapping("/{id}/recommendations")
    public ResponseEntity<ApiResponse<List<JobRecommendationDto>>> getJobRecommendations(@PathVariable Long id) {
        validateStudentAccess(id);
        return ResponseEntity.ok(ApiResponse.ok(candidateMatchingService.getRecommendationsForStudent(id)));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @GetMapping("/{id}/attendance")
    public ResponseEntity<ApiResponse<List<Attendance>>> getAttendance(@PathVariable Long id) {
        validateStudentAccess(id);
        return ResponseEntity.ok(ApiResponse.ok(studentService.getStudentAttendance(id)));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @GetMapping("/{id}/assignments")
    public ResponseEntity<ApiResponse<List<Assignment>>> getDepartmentAssignments(@PathVariable Long id) {
        validateStudentAccess(id);
        return ResponseEntity.ok(ApiResponse.ok(studentService.getDepartmentAssignments(id)));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @GetMapping("/{id}/study-materials")
    public ResponseEntity<ApiResponse<List<StudyMaterial>>> getStudyMaterials(@PathVariable Long id) {
        validateStudentAccess(id);
        return ResponseEntity.ok(ApiResponse.ok(studentService.getStudyMaterials(id)));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @GetMapping("/{id}/submissions")
    public ResponseEntity<ApiResponse<List<AssignmentSubmission>>> getSubmissions(@PathVariable Long id) {
        validateStudentAccess(id);
        return ResponseEntity.ok(ApiResponse.ok(studentService.getStudentSubmissions(id)));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @PostMapping("/{studentId}/assignments/{assignmentId}/submit")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> submitAssignment(
            @PathVariable Long studentId,
            @PathVariable Long assignmentId,
            @RequestBody Map<String, String> body) {
        validateStudentAccess(studentId);
        String fileUrl = body.get("fileUrl");
        String comments = body.get("comments");
        AssignmentSubmission saved = studentService.submitAssignment(studentId, assignmentId, fileUrl, comments);
        return ResponseEntity.ok(ApiResponse.ok("Assignment submitted successfully", saved));
    }
}
