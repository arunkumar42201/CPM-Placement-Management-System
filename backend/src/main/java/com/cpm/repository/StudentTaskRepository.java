package com.cpm.repository;

import com.cpm.entity.StudentTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StudentTaskRepository extends MongoRepository<StudentTask, Long> {
    @Query(value = "{'student': ?0}", sort = "{'dueDate': 1}")
    List<StudentTask> findByStudentIdOrderByDueDateAsc(Long studentId);
    @Query("{'student': ?0, 'completed': ?1}")
    List<StudentTask> findByStudentIdAndCompleted(Long studentId, Boolean completed);
    
    @Query("{'student': ?0, 'dueDate': ?1}")
    List<StudentTask> findDailyTasks(@Param("studentId") Long studentId, @Param("date") LocalDate date);

    @Query("{'student': ?0, 'dueDate': {'$gte': ?1, '$lte': ?2}}")
    List<StudentTask> findTasksBetweenDates(@Param("studentId") Long studentId, 
                                           @Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);

    @Query(value = "{'student': ?0, 'completed': true}", count = true)
    long countByStudentIdAndCompletedTrue(Long studentId);
    @Query(value = "{'student': ?0, 'completed': false}", count = true)
    long countByStudentIdAndCompletedFalse(Long studentId);
}
