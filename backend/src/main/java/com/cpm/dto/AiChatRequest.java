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
public class AiChatRequest {
    private String message;
    private String role; // STUDENT, TEACHER, PLACEMENT_OFFICER, COMPANY, ADMIN
    private String context; // e.g. "student_profile", "interview_prep", "job_view"
    private List<ChatMessage> history;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessage {
        private String sender; // "user" or "ai"
        private String text;
    }
}
