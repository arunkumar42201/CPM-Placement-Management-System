package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private StudentProfile student;

        private String fileName;

        private String fileUrl;

    private Integer version;

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Builder.Default
    private Boolean isPrimary = true;
}
