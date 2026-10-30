package com.cpm.repository;

import com.cpm.entity.PlacementResult;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementResultRepository extends MongoRepository<PlacementResult, Long> {
    @Query("{'student': ?0}")
    List<PlacementResult> findByStudentId(Long studentId);
    @Query("{'company': ?0}")
    List<PlacementResult> findByCompanyId(Long companyId);
    @Query("{'student': ?0, 'job': ?1}")
    Optional<PlacementResult> findByStudentIdAndJobId(Long studentId, Long jobId);

    @Aggregation(pipeline = "{'$group': {'_id': null, 'value': {'$max': '$packageLpa'}}}")
    Double findHighestPackage();

    @Aggregation(pipeline = "{'$group': {'_id': null, 'value': {'$avg': '$packageLpa'}}}")
    Double findAveragePackage();

    @Aggregation(pipeline = {
            "{'$match': {'isOfferAccepted': true}}",
            "{'$group': {'_id': '$student', 'count': {'$sum': 1}}}",
            "{'$count': 'count'}"
    })
    long countPlacedStudents();
}
