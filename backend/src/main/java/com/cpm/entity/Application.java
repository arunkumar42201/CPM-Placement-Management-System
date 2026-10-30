package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private StudentProfile student;

    @DocumentReference(lazy = false)
    private Job job;

    @DocumentReference(lazy = false)
    private PlacementDrive placementDrive;

    @Builder.Default
    private String status = "APPLIED"; 
    // APPLIED, SHORTLISTED, APTITUDE_TEST, TECH_INTERVIEW, HR_INTERVIEW, OFFERED, REJECTED, WITHDRAWN

    private Integer matchPercentage;

        private String coverNote;

        private String recruiterFeedback;

    private String resumeUrl;

    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

}
