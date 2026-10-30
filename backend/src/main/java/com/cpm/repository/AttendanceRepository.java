package com.cpm.repository;

import com.cpm.entity.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, Long> {
    @Query(value = "{'student': ?0}", sort = "{'date': -1}")
    List<Attendance> findByStudentIdOrderByDateDesc(Long studentId);
    @Query(value = "{'teacher': ?0}", sort = "{'date': -1}")
    List<Attendance> findByTeacherIdOrderByDateDesc(Long teacherId);
    @Query("{'course': ?0, 'date': ?1}")
    List<Attendance> findByCourseIdAndDate(Long courseId, LocalDate date);
    @Query(value = "{'student': ?0, 'status': ?1}", count = true)
    long countByStudentIdAndStatus(Long studentId, String status);
    @Query(value = "{'student': ?0}", count = true)
    long countByStudentId(Long studentId);
}
