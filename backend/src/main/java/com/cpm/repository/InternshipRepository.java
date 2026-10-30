package com.cpm.repository;

import com.cpm.entity.Internship;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends MongoRepository<Internship, Long> {
    @Query("{'student': ?0}")
    List<Internship> findByStudentId(Long studentId);
}
