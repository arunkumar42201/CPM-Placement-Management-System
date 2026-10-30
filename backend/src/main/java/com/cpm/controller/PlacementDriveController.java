package com.cpm.controller;

import com.cpm.dto.ApiResponse;
import com.cpm.entity.PlacementDrive;
import com.cpm.service.PlacementDriveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placement-drives")
public class PlacementDriveController {

    @Autowired
    private PlacementDriveService placementDriveService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlacementDrive>>> getAllDrives(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(placementDriveService.getDrivesByStatus(status)));
        }
        return ResponseEntity.ok(ApiResponse.ok(placementDriveService.getAllDrives()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementDrive>> getDriveById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(placementDriveService.getDriveById(id)));
    }

    @PostMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<PlacementDrive>> createDrive(@PathVariable Long companyId, @RequestBody PlacementDrive drive) {
        PlacementDrive created = placementDriveService.createDrive(companyId, drive);
        return ResponseEntity.ok(ApiResponse.ok("Drive created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementDrive>> updateDrive(@PathVariable Long id, @RequestBody PlacementDrive drive) {
        PlacementDrive updated = placementDriveService.updateDrive(id, drive);
        return ResponseEntity.ok(ApiResponse.ok("Drive updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDrive(@PathVariable Long id) {
        placementDriveService.deleteDrive(id);
        return ResponseEntity.ok(ApiResponse.ok("Drive deleted", null));
    }
}
