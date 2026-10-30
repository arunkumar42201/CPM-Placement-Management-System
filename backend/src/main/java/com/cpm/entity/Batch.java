package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;

@Document(collection = "batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batch {

    @MongoId(FieldType.INT64)
    private Long id;

        private String name; // e.g. "2021 - 2025"

    private Integer startYear;
    private Integer endYear;

    @DocumentReference(lazy = false)
    private Department department;
}
