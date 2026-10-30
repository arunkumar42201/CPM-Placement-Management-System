package com.cpm.repository;

import com.cpm.entity.StudentSkill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSkillRepository extends MongoRepository<StudentSkill, Long> {
    @Query("{'student': ?0}")
    List<StudentSkill> findByStudentId(Long studentId);
    void deleteByStudentId(Long studentId);
}
