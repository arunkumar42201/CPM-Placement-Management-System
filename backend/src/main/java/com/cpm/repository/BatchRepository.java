package com.cpm.repository;

import com.cpm.entity.Batch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatchRepository extends MongoRepository<Batch, Long> {
    @Query("{'department': ?0}")
    List<Batch> findByDepartmentId(Long departmentId);
}
