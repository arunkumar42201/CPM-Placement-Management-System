package com.cpm.repository;

import com.cpm.entity.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, Long> {
    List<Job> findByStatus(String status);
    @Query("{$or: [{'company': ?0}, {'company.$id': ?0}]}")
    List<Job> findByCompanyId(Long companyId);
    @Query("{$or: [{'placementDrive': ?0}, {'placementDrive.$id': ?0}]}")
    List<Job> findByPlacementDriveId(Long driveId);
}
