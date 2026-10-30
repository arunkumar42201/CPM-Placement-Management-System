package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDate;

@Document(collection = "attendance_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private StudentProfile student;

    @DocumentReference(lazy = false)
    private TeacherProfile teacher;

    @DocumentReference(lazy = false)
    private Course course;

    private String subjectName;
    private LocalDate date;
    
    @Builder.Default
    private String status = "PRESENT"; // PRESENT, ABSENT, LATE, EXCUSED
}
