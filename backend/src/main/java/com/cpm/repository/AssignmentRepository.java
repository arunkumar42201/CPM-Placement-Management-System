package com.cpm.repository;

import com.cpm.entity.Assignment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends MongoRepository<Assignment, Long> {
    @Query(value = "{'teacher': ?0}", sort = "{'dueDate': -1}")
    List<Assignment> findByTeacherIdOrderByDueDateDesc(Long teacherId);
    @Query(value = "{'department': ?0}", sort = "{'dueDate': -1}")
    List<Assignment> findByDepartmentIdOrderByDueDateDesc(Long departmentId);
}
