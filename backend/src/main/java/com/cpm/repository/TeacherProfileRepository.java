package com.cpm.repository;

import com.cpm.entity.TeacherProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherProfileRepository extends MongoRepository<TeacherProfile, Long> {
    @Query("{'user': ?0}")
    Optional<TeacherProfile> findByUserId(Long userId);
    @Query("{'department': ?0}")
    List<TeacherProfile> findByDepartmentId(Long departmentId);
}
