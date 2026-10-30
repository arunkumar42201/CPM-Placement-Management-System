package com.cpm.repository;

import com.cpm.entity.Certification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends MongoRepository<Certification, Long> {
    @Query("{'student': ?0}")
    List<Certification> findByStudentId(Long studentId);
}
