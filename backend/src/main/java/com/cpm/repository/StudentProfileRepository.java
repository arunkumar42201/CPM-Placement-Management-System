package com.cpm.repository;

import com.cpm.entity.StudentProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends MongoRepository<StudentProfile, Long> {
    @Query("{$or: [{'user': ?0}, {'user.$id': ?0}]}")
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findByRollNumber(String rollNumber);
       boolean existsByRollNumber(String rollNumber);
       boolean existsByEnrollmentNumber(String enrollmentNumber);
    
    @Query("{$or: [{'department': ?0}, {'department.$id': ?0}]}")
    List<StudentProfile> findByDepartmentId(Long departmentId);
    @Query("{$or: [{'batch': ?0}, {'batch.$id': ?0}]}")
    List<StudentProfile> findByBatchId(Long batchId);
}
