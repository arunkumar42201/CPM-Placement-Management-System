package com.cpm.repository;

import com.cpm.entity.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends MongoRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    @Query("{'department': ?0}")
    List<Course> findByDepartmentId(Long departmentId);
}
