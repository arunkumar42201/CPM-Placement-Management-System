package com.cpm.repository;

import com.cpm.entity.Interview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends MongoRepository<Interview, Long> {
    @Query(value = "{'application': ?0}", sort = "{'scheduledAt': 1}")
    List<Interview> findByApplicationId(Long applicationId);

    @Query(value = "{'application': {$in: ?0}}", sort = "{'scheduledAt': 1}")
    List<Interview> findByApplicationIdIn(List<Long> applicationIds);

    List<Interview> findByStatus(String status);
}
