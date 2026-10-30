package com.cpm.dto;

import com.cpm.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;
    private Role role; // Optional; defaults to STUDENT if not provided

    // Student specific
    private String rollNumber;
    private String enrollmentNumber;
    private Long departmentId;
    private Long courseId;
    private Long batchId;
    private Double cgpa;

    // Company specific
    private String companyName;
    private String industry;
    private String website;
    private String location;

    // Faculty / Teacher specific
    private String employeeId;
    private String designation;
    private String qualification;
    private Integer experienceYears;
    private String cabinLocation;
}
