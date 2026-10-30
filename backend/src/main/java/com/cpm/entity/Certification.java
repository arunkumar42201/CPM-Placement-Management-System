package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDate;

@Document(collection = "certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private StudentProfile student;

        private String title;

        private String issuer; // e.g. "AWS", "Oracle", "Coursera"

    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String credentialId;
    private String credentialUrl;
}
