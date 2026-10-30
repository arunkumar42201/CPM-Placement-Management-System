package com.cpm.service;

import com.cpm.config.JwtTokenProvider;
import com.cpm.dto.AuthRequest;
import com.cpm.dto.AuthResponse;
import com.cpm.dto.RegisterRequest;
import com.cpm.entity.*;
import com.cpm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private NotificationService notificationService;

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());

        Long profileId = null;
        if (user.getRole() == Role.STUDENT) {
            StudentProfile profile = studentProfileRepository.findByUserId(user.getId()).orElse(null);
            profileId = profile != null ? profile.getId() : null;
        } else if (user.getRole() == Role.COMPANY || user.getRole() == Role.RECRUITER) {
            CompanyProfile profile = companyProfileRepository.findByUserId(user.getId()).orElse(null);
            profileId = profile != null ? profile.getId() : null;
        } else if (user.getRole() == Role.TEACHER) {
            TeacherProfile profile = teacherProfileRepository.findByUserId(user.getId()).orElse(null);
            profileId = profile != null ? profile.getId() : null;
        }

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .profileId(profileId)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already registered!");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.STUDENT;

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .active(true)
                .build();

        user = userRepository.save(Objects.requireNonNull(user));

        Long profileId = null;
        if (role == Role.STUDENT) {
            String roll = (request.getRollNumber() != null && !request.getRollNumber().isBlank())
                    ? request.getRollNumber() : "CPM26" + (System.currentTimeMillis() % 100000);
            String enrollment = request.getEnrollmentNumber() != null && !request.getEnrollmentNumber().isBlank()
                ? request.getEnrollmentNumber() : "ENR" + roll;
            if (studentProfileRepository.existsByRollNumber(roll)) {
            throw new RuntimeException("Roll number is already registered. Please use a unique roll number.");
            }
            if (studentProfileRepository.existsByEnrollmentNumber(enrollment)) {
            throw new RuntimeException("Enrollment number is already registered. Please use a unique enrollment number.");
            }
            StudentProfile profile = StudentProfile.builder()
                    .user(user)
                    .rollNumber(roll)
                .enrollmentNumber(enrollment)
                    .cgpa(request.getCgpa() != null ? request.getCgpa() : 0.0)
                    .activeBacklogs(0)
                    .currentSemester(1)
                    .resumeVersion(1)
                    .build();

            if (request.getDepartmentId() != null) {
                departmentRepository.findById(Objects.requireNonNull(request.getDepartmentId())).ifPresent(profile::setDepartment);
            } else {
                departmentRepository.findAll().stream().findFirst().ifPresent(profile::setDepartment);
            }
            if (request.getCourseId() != null) {
                courseRepository.findById(Objects.requireNonNull(request.getCourseId())).ifPresent(profile::setCourse);
            }
            if (request.getBatchId() != null) {
                batchRepository.findById(Objects.requireNonNull(request.getBatchId())).ifPresent(profile::setBatch);
            }

            profile = studentProfileRepository.save(Objects.requireNonNull(profile));
            profileId = profile.getId();
        } else if (role == Role.COMPANY || role == Role.RECRUITER) {
            CompanyProfile company = CompanyProfile.builder()
                    .user(user)
                    .companyName(request.getCompanyName() != null ? request.getCompanyName() : user.getFullName())
                    .industry(request.getIndustry())
                    .website(request.getWebsite())
                    .location(request.getLocation())
                    .contactPerson(user.getFullName())
                    .contactPhone(user.getPhone())
                    .isApproved(false)
                    .build();

            company = companyProfileRepository.save(Objects.requireNonNull(company));
            profileId = company.getId();
        } else if (role == Role.TEACHER) {
            TeacherProfile teacher = TeacherProfile.builder()
                    .user(user)
                    .employeeId(request.getEmployeeId() != null && !request.getEmployeeId().isBlank() ? request.getEmployeeId() : "EMP" + (System.currentTimeMillis() % 100000))
                    .designation(request.getDesignation() != null && !request.getDesignation().isBlank() ? request.getDesignation() : "Assistant Professor")
                    .qualification(request.getQualification() != null && !request.getQualification().isBlank() ? request.getQualification() : "Ph.D / M.Tech")
                    .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 4)
                    .cabinLocation(request.getCabinLocation() != null && !request.getCabinLocation().isBlank() ? request.getCabinLocation() : "Academic Block - 302")
                    .build();

            if (request.getDepartmentId() != null) {
                departmentRepository.findById(Objects.requireNonNull(request.getDepartmentId())).ifPresent(teacher::setDepartment);
            } else {
                departmentRepository.findAll().stream().findFirst().ifPresent(teacher::setDepartment);
            }

            teacher = teacherProfileRepository.save(Objects.requireNonNull(teacher));
            profileId = teacher.getId();
        }

        if (role == Role.STUDENT) {
            notificationService.createNotification(
                    user,
                    "Welcome to CPM Portal",
                    "Your candidate account is ready. Complete your profile to get started.",
                    "SYSTEM",
                    "/student/profile"
            );
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .profileId(profileId)
                .build();
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("No authenticated user");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    public AuthResponse getCurrentUserResponse() {
        User user = getCurrentUser();

        Long profileId = null;
        if (user.getRole() == Role.STUDENT) {
            var profile = studentProfileRepository.findByUserId(user.getId());
            if (profile.isPresent()) profileId = profile.get().getId();
        } else if (user.getRole() == Role.COMPANY || user.getRole() == Role.RECRUITER) {
            var profile = companyProfileRepository.findByUserId(user.getId());
            if (profile.isPresent()) profileId = profile.get().getId();
        } else if (user.getRole() == Role.TEACHER) {
            var profile = teacherProfileRepository.findByUserId(user.getId());
            if (profile.isPresent()) profileId = profile.get().getId();
        }

        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .profileId(profileId)
                .build();
    }
}
