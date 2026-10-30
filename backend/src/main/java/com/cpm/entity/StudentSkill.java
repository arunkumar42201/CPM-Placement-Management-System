package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;

@Document(collection = "student_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSkill {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private StudentProfile student;

    @DocumentReference(lazy = false)
    private Skill skill;

    private String proficiency; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
}
