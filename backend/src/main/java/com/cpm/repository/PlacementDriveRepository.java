package com.cpm.repository;

import com.cpm.entity.PlacementDrive;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementDriveRepository extends MongoRepository<PlacementDrive, Long> {
    List<PlacementDrive> findByStatus(String status);
    @Query("{$or: [{'company': ?0}, {'company.$id': ?0}]}")
    List<PlacementDrive> findByCompanyId(Long companyId);
    long countByStatus(String status);
}
