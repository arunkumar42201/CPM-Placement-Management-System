package com.cpm.repository;

import com.cpm.entity.AssignmentSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends MongoRepository<AssignmentSubmission, Long> {
    @Query("{'assignment': ?0}")
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
    @Query("{'student': ?0}")
    List<AssignmentSubmission> findByStudentId(Long studentId);
    @Query("{'assignment': ?0, 'student': ?1}")
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
}
