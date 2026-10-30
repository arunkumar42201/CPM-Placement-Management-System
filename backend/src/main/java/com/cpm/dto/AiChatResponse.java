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
public class AiChatResponse {
    private String reply;
    private List<String> suggestions;
    private String actionType; // e.g. "NAVIGATE_RESUME", "VIEW_JOBS", "MOCK_INTERVIEW"
    private String actionUrl;
}
