package com.cpm.service;

import com.cpm.entity.Notification;
import com.cpm.entity.User;
import com.cpm.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Notification createNotification(User user, String title, String message, String type, String actionLink) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type != null ? type : "SYSTEM")
                .actionLink(actionLink)
                .isRead(false)
                .build();

        Notification saved = notificationRepository.save(Objects.requireNonNull(notification));

        // Broadcast to user WebSocket topic if enabled
        if (messagingTemplate != null && user != null && user.getEmail() != null) {
            try {
                messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), saved);
            } catch (Exception e) {
                // Ignore WebSocket failure, database persistence is preserved
            }
        }

        return saved;
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notif = notificationRepository.findById(Objects.requireNonNull(notificationId))
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        notif.setIsRead(true);
        return notificationRepository.save(Objects.requireNonNull(notif));
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(Objects.requireNonNull(unread));
    }
}
