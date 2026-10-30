package com.cpm.controller;

import com.cpm.dto.*;
import com.cpm.entity.User;
import com.cpm.service.AiService;
import com.cpm.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @Autowired
    private AuthService authService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(@RequestBody AiChatRequest request) {
        User currentUser = null;
        try {
            currentUser = authService.getCurrentUser();
        } catch (Exception ignored) {}
        AiChatResponse response = aiService.processChat(request, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/mock-interview/questions")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getMockQuestions(
            @RequestParam(defaultValue = "Software Engineer") String roleCategory,
            @RequestParam(defaultValue = "TECHNICAL") String roundType,
            @RequestParam(defaultValue = "3") int count
    ) {
        List<Map<String, String>> questions = aiService.generateMockQuestions(roleCategory, roundType, count);
        return ResponseEntity.ok(ApiResponse.ok(questions));
    }

    @PostMapping("/mock-interview/evaluate")
    public ResponseEntity<ApiResponse<MockInterviewEvaluateResponse>> evaluateAnswer(
            @RequestBody MockInterviewEvaluateRequest request
    ) {
        MockInterviewEvaluateResponse response = aiService.evaluateMockAnswer(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/resume/polish")
    public ResponseEntity<ApiResponse<Map<String, String>>> polishResumeBullet(@RequestBody Map<String, String> body) {
        String text = body.getOrDefault("text", "");
        String roleTarget = body.getOrDefault("roleTarget", "Software Engineer");
        Map<String, String> result = aiService.polishResumeBullet(text, roleTarget);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/resume/summary")
    public ResponseEntity<ApiResponse<Map<String, String>>> generateSummary(@RequestBody Map<String, Object> body) {
        String fullName = body.getOrDefault("fullName", "Student").toString();
        String department = body.getOrDefault("department", "Computer Science").toString();
        Double cgpa = body.get("cgpa") != null ? Double.valueOf(body.get("cgpa").toString()) : 8.5;
        List<String> skills = body.get("skills") instanceof List<?> items
                ? items.stream().map(String::valueOf).toList()
                : List.of();
        Map<String, String> result = aiService.generateCareerSummary(fullName, department, cgpa, skills);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/resume/keywords")
    public ResponseEntity<ApiResponse<List<String>>> getKeywords(@RequestParam(defaultValue = "Software Engineer") String targetRole) {
        List<String> keywords = aiService.recommendAtsKeywords(targetRole);
        return ResponseEntity.ok(ApiResponse.ok(keywords));
    }

    @PostMapping("/job/generate")
    public ResponseEntity<ApiResponse<Map<String, String>>> generateJob(@RequestBody Map<String, String> body) {
        String roleTitle = body.getOrDefault("title", "Associate Software Engineer");
        String companyName = body.getOrDefault("companyName", "Tech Partner");
        String industry = body.getOrDefault("industry", "Technology");
        Map<String, String> result = aiService.generateJobDescription(roleTitle, companyName, industry);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/candidate/questions")
    public ResponseEntity<ApiResponse<List<String>>> generateCandidateQuestions(@RequestBody Map<String, Object> body) {
        String name = body.getOrDefault("name", "Candidate").toString();
        String jobTitle = body.getOrDefault("jobTitle", "Software Engineer").toString();
        List<String> matched = body.get("matchedSkills") instanceof List<?> items
                ? items.stream().map(String::valueOf).toList()
                : List.of();
        List<String> missing = body.get("missingSkills") instanceof List<?> items
                ? items.stream().map(String::valueOf).toList()
                : List.of();
        List<String> questions = aiService.generateCandidateQuestions(name, jobTitle, matched, missing);
        return ResponseEntity.ok(ApiResponse.ok(questions));
    }
}
