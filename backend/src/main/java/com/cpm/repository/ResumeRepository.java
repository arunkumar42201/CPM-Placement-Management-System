package com.cpm.repository;

import com.cpm.entity.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends MongoRepository<Resume, Long> {
    @Query(value = "{'student': ?0}", sort = "{'version': -1}")
    List<Resume> findByStudentIdOrderByVersionDesc(Long studentId);
    @Query("{'student': ?0, 'isPrimary': true}")
    Optional<Resume> findByStudentIdAndIsPrimaryTrue(Long studentId);
}
