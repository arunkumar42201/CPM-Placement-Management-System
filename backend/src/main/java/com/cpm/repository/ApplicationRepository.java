package com.cpm.repository;

import com.cpm.entity.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, Long> {
    @Query(value = "{$or: [{'student': ?0}, {'student.$id': ?0}]}", sort = "{'appliedAt': -1}")
    List<Application> findByStudentIdOrderByAppliedAtDesc(Long studentId);
    @Query(value = "{$or: [{'job': ?0}, {'job.$id': ?0}]}", sort = "{'appliedAt': -1}")
    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);
    @Query(value = "{$or: [{'job': {$in: ?0}}, {'job.$id': {$in: ?0}}]}", sort = "{'appliedAt': -1}")
    List<Application> findByJobIdInOrderByAppliedAtDesc(List<Long> jobIds);
    @Query(value = "{$or: [{'placementDrive': ?0}, {'placementDrive.$id': ?0}]}", sort = "{'appliedAt': -1}")
    List<Application> findByPlacementDriveIdOrderByAppliedAtDesc(Long driveId);
    @Query("{$and: [{$or: [{'student': ?0}, {'student.$id': ?0}]}, {$or: [{'job': ?1}, {'job.$id': ?1}]}]}")
    Optional<Application> findByStudentIdAndJobId(Long studentId, Long jobId);
    @Query(value = "{$and: [{$or: [{'student': ?0}, {'student.$id': ?0}]}, {$or: [{'job': ?1}, {'job.$id': ?1}]}]}", exists = true)
    Boolean existsByStudentIdAndJobId(Long studentId, Long jobId);

    List<Application> findByStatus(String status);
    long countByStatus(String status);

    @Query(value = "{$or: [{'job': {$in: ?0}}, {'job.$id': {$in: ?0}}]}", count = true)
    long countByCompanyId(List<Long> jobIds);

    @Query(value = "{$or: [{'job': {$in: ?0}}, {'job.$id': {$in: ?0}}]}", sort = "{'appliedAt': -1}")
    List<Application> findByCompanyId(List<Long> jobIds);
}
