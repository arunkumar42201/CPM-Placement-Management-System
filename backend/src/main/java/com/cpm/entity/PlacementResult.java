package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "placement_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementResult {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private StudentProfile student;

    @DocumentReference(lazy = false)
    private Job job;

    @DocumentReference(lazy = false)
    private CompanyProfile company;

    private Double packageLpa;
    private String designation;
    private String offerLetterUrl;
    private LocalDate selectionDate;

    @Builder.Default
    private Boolean isOfferAccepted = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
