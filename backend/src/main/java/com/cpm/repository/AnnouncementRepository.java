package com.cpm.repository;

import com.cpm.entity.Announcement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends MongoRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByIsPinnedDescCreatedAtDesc();
    List<Announcement> findByTargetRoleOrderByCreatedAtDesc(String targetRole);
}
