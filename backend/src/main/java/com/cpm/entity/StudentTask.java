package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "student_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentTask {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private StudentProfile student;

        private String title;

        private String description;

    private String category; // CODING, APTITUDE, RESUME, APPLICATION, INTERVIEW_PREP, ACADEMIC

    @Builder.Default
    private String priority = "MEDIUM"; // HIGH, MEDIUM, LOW

    private LocalDate dueDate;

    @Builder.Default
    private Boolean completed = false;

    private LocalDateTime completedAt;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
