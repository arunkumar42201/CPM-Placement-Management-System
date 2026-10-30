package com.cpm.service;

import com.cpm.entity.Announcement;
import com.cpm.entity.Department;
import com.cpm.repository.AnnouncementRepository;
import com.cpm.repository.DepartmentRepository;
import com.cpm.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByIsPinnedDescCreatedAtDesc();
    }

    public List<Announcement> getAnnouncementsByRole(String role) {
        return announcementRepository.findByTargetRoleOrderByCreatedAtDesc(role);
    }

    @Transactional
    public Announcement createAnnouncement(Announcement announcement, Long departmentId) {
        if (departmentId != null) {
            Department dept = departmentRepository.findById(departmentId).orElse(null);
            announcement.setDepartment(dept);
        }
        if (announcement.getTargetRole() == null) {
            announcement.setTargetRole("ALL");
        }
        Announcement saved = announcementRepository.save(Objects.requireNonNull(announcement));
        String targetRole = saved.getTargetRole();
        if ("ALL".equalsIgnoreCase(targetRole) || "STUDENT".equalsIgnoreCase(targetRole)) {
            studentProfileRepository.findAll().stream()
                .filter(profile -> saved.getDepartment() == null
                    || (profile.getDepartment() != null
                    && saved.getDepartment().getId().equals(profile.getDepartment().getId())))
                .forEach(profile -> notificationService.createNotification(
                    profile.getUser(),
                    "New announcement: " + saved.getTitle(),
                    saved.getContent(),
                    "ANNOUNCEMENT",
                    "/student/announcements"
                ));
        }
        return saved;
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(Objects.requireNonNull(id));
    }
}
