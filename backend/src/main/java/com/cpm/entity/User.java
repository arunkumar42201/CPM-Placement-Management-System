package com.cpm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @MongoId(FieldType.INT64)
    private Long id;

        private String email;

    @JsonIgnore
        private String password;

        private String fullName;

    private String phone;

            private Role role;

    @Builder.Default
    private boolean active = true;

    private String avatarUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
