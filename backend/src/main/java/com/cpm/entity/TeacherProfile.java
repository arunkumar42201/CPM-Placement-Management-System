package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;

@Document(collection = "teacher_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherProfile {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private User user;

    private String employeeId;
    private String designation; // e.g. "Associate Professor", "Placement Coordinator"

    @DocumentReference(lazy = false)
    private Department department;

    private String qualification;
    private Integer experienceYears;
    private String cabinLocation;
}
