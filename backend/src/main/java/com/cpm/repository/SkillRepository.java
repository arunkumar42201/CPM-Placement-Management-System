package com.cpm.repository;

import com.cpm.entity.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends MongoRepository<Skill, Long> {
    Optional<Skill> findByNameIgnoreCase(String name);
    List<Skill> findByCategory(String category);
}
