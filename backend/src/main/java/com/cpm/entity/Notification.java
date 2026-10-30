package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private User user;

        private String title;

        private String message;

    private String type; // DRIVE, APPLICATION, SHORTLIST, INTERVIEW, ASSIGNMENT, TEST, SYSTEM

    private String actionLink;

    @Builder.Default
    private Boolean isRead = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
