package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    @MongoId(FieldType.INT64)
    private Long id;

    @DocumentReference(lazy = false)
    private Application application;

        private String roundName; // e.g. "Online Assessment", "Technical Round 1", "HR Round"

    private String interviewType; // ONLINE, IN_PERSON, PHONE

    private LocalDateTime scheduledAt;
    private Integer durationMinutes;

    private String meetingLink;
    private String venue;
    private String interviewerName;

    @Builder.Default
    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED

        private String feedback;

    private Integer score; // e.g. out of 100
}
