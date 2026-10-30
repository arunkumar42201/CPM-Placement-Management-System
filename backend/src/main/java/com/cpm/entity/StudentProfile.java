package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private User user;

        private String rollNumber;

        private String enrollmentNumber;

    private String collegeName;
    private String universityName;

    @DocumentReference(lazy = false)
    private Department department;

    @DocumentReference(lazy = false)
    private Course course;

    @DocumentReference(lazy = false)
    private Batch batch;

    private Integer currentSemester;

    private Double cgpa;
    private Double tenthPercentage;
    private Double twelfthPercentage;
    private Double graduationPercentage;
    
    @Builder.Default
    private Integer activeBacklogs = 0;

    private String gender;
    private LocalDate dob;
    private String address;
    private String city;
    private String state;

    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;

    private String resumeUrl;
    private Integer resumeVersion;

        private String bio;

        private String achievements;

    @DocumentReference(lazy = false)
    @Builder.Default
    private List<StudentSkill> skills = new ArrayList<>();

    @DocumentReference(lazy = false)
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    @DocumentReference(lazy = false)
    @Builder.Default
    private List<Certification> certifications = new ArrayList<>();

    @DocumentReference(lazy = false)
    @Builder.Default
    private List<Internship> internships = new ArrayList<>();
}
