package com.cpm.repository;

import com.cpm.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, Long> {
    @Query(value = "{'user': ?0}", sort = "{'createdAt': -1}")
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    @Query(value = "{'user': ?0, 'isRead': false}", sort = "{'createdAt': -1}")
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    @Query(value = "{'user': ?0, 'isRead': false}", count = true)
    long countByUserIdAndIsReadFalse(Long userId);
}
