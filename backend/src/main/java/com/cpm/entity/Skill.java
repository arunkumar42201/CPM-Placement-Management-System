package com.cpm.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import lombok.*;

@Document(collection = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @MongoId(FieldType.INT64)
    private Long id;

        private String name;

    private String category; // e.g., "Programming Languages", "Web", "Database", "DevOps", "AI/ML", "Soft Skills"
}
