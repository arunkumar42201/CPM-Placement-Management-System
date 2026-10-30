package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "placement_drives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementDrive {

    @MongoId(FieldType.INT64)
    private Long id;

        private String title;

        private String description;

    @DocumentReference(lazy = false)
    private CompanyProfile company;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationDeadline;

    private String venue; // e.g. "Campus Auditorium & Online"
    private Double minCgpa;
    private String eligibleBranches; // e.g. "CSE, IT, ECE"
    private Integer maxBacklogs;

    private String rounds; // e.g. "Online Aptitude -> Technical Interview -> HR Round"
    
    @Builder.Default
    private String status = "UPCOMING"; // UPCOMING, ONGOING, COMPLETED, CANCELLED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
