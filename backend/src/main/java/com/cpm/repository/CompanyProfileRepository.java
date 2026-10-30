package com.cpm.repository;

import com.cpm.entity.CompanyProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyProfileRepository extends MongoRepository<CompanyProfile, Long> {
    @Query("{'user': ?0}")
    Optional<CompanyProfile> findByUserId(Long userId);

    List<CompanyProfile> findByIsApprovedTrue();
    List<CompanyProfile> findByIsApprovedFalse();
    long countByIsApprovedTrue();
}
