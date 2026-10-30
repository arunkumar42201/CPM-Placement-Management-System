package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private TeacherProfile teacher;

    @DocumentReference(lazy = false)
    private Department department;

        private String title;

    private String subject;

        private String description;

    private LocalDate dueDate;
    private Integer maxMarks;
    private String fileAttachmentUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
