package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "study_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyMaterial {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private TeacherProfile teacher;

        private String title;

    private String subject;

        private String description;

    private String category; // LECTURE_NOTES, SYLLABUS, PLACEMENT_PREP, CODE_SAMPLE, ASSIGNMENT_HELP

    private String fileUrl;
    private String resourceLink;

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
