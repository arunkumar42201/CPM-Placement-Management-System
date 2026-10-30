package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.entity.Announcement;
import com.cpm.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Announcement>>> getAllAnnouncements(@RequestParam(required = false) String role) {
        if (role != null && !role.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(announcementService.getAnnouncementsByRole(role)));
        }
        return ResponseEntity.ok(ApiResponse.ok(announcementService.getAllAnnouncements()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(
            @RequestParam(required = false) Long departmentId,
            @RequestBody Announcement announcement) {
        Announcement created = announcementService.createAnnouncement(announcement, departmentId);
        return ResponseEntity.ok(ApiResponse.ok("Announcement published", created));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok(ApiResponse.ok("Announcement deleted", null));
    }
}
