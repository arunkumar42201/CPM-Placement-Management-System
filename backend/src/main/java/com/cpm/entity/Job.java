package com.cpm.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private CompanyProfile company;

    @DocumentReference(lazy = false)
    private PlacementDrive placementDrive;

        private String title;

        private String description;

        private String requirements;

        private String requiredSkills; // Comma-separated: "Java, Spring Boot, MySQL, REST"

        private String preferredSkills; // Comma-separated: "Docker, AWS, React"

    @JsonProperty("ctcLpa")
    private Double salary; // In LPA, e.g. 12.5
    private String salaryCurrency; // e.g. "INR LPA"

    private String jobType; // FULL_TIME, INTERNSHIP, INTERNSHIP_PPO

    private String location; // e.g. "Bengaluru / Pune"
    private String workMode; // REMOTE, ON_SITE, HYBRID

    private Integer experienceYears; // 0 for freshers
    private String education; // e.g. "B.Tech, B.E., M.Tech"
    private String branch; // e.g. "CSE, IT, ECE"
    
    private Double minCgpa; // e.g. 7.0
    @Builder.Default
    private Integer maxBacklogs = 0;

    private LocalDate deadline;
    private Integer openings;

        private String selectionProcess;

    @Builder.Default
    private String status = "PENDING"; // PENDING, ACTIVE, REJECTED, CLOSED, DRAFT

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
