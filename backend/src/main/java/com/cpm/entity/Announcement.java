package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "announcements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement {

    @MongoId(FieldType.INT64)
    private Long id;

        private String title;

        private String content;

    private String targetRole; // ALL, STUDENT, TEACHER, COMPANY

    @DocumentReference(lazy = false)
    private Department department;

    private String authorName;
    private String authorRole;

    @Builder.Default
    private Boolean isPinned = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
