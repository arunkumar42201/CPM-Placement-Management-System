package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDate;

@Document(collection = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private StudentProfile student;

        private String title;

        private String description;

    private String techStack; // comma-separated e.g. "React, Spring Boot, MySQL"
    private String githubUrl;
    private String liveUrl;

    private LocalDate startDate;
    private LocalDate endDate;
    
    @Builder.Default
    private Boolean isOngoing = false;
}
