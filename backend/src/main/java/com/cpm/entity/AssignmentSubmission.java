package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "assignment_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSubmission {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private Assignment assignment;

    @DocumentReference(lazy = false)
    private StudentProfile student;

    private String submissionFileUrl;

        private String comments;

    private Integer marksAwarded;

        private String feedback;

    @Builder.Default
    private String status = "SUBMITTED"; // SUBMITTED, GRADED, LATE

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();
}
