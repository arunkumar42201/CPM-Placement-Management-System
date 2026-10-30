package com.cpm.repository;

import com.cpm.entity.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, Long> {
    @Query("{'student': ?0}")
    List<Project> findByStudentId(Long studentId);
}
