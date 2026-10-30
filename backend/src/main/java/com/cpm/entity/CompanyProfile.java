package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;

@Document(collection = "company_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyProfile {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private User user;

        private String companyName;

    private String logoUrl;

        private String description;

    private String industry; // e.g. "Information Technology", "FinTech", "Automobile"
    private String website;
    private String location; // e.g. "Bengaluru, India"
    private String contactPerson;
    private String contactPhone;
    private String recruiterDesignation;

    @Builder.Default
    private Boolean isApproved = false;
}
