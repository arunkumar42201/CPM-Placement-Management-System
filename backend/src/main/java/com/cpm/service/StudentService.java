package com.cpm.service;

import com.cpm.entity.*;
import com.cpm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class StudentService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentSubmissionRepository assignmentSubmissionRepository;

    @Autowired
    private StudyMaterialRepository studyMaterialRepository;

    @Autowired
    private TeacherService teacherService;

    public StudentProfile getProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student profile not found for user ID: " + userId));
    }

    public StudentProfile getOrCreateProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(Objects.requireNonNull(userId))
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            if (user.getRole() != Role.STUDENT) {
                throw new IllegalArgumentException("Only student accounts can have a student profile.");
            }

            String profileSuffix = String.valueOf(userId);
            StudentProfile profile = StudentProfile.builder()
                    .user(user)
                    .rollNumber("CPM" + profileSuffix)
                    .enrollmentNumber("ENR" + profileSuffix)
                    .cgpa(0.0)
                    .activeBacklogs(0)
                    .currentSemester(1)
                    .resumeVersion(1)
                    .build();
            return studentProfileRepository.save(Objects.requireNonNull(profile));
        });
    }

    public StudentProfile getProfileById(Long studentId) {
        return studentProfileRepository.findById(Objects.requireNonNull(studentId))
                .orElseThrow(() -> new RuntimeException("Student profile not found for ID: " + studentId));
    }

    public List<StudentProfile> getAllStudents() {
        return studentProfileRepository.findAll();
    }

    @Transactional
    public StudentProfile updateProfile(Long studentId, StudentProfile updated) {
        StudentProfile existing = getProfileById(studentId);

        if (updated.getUser() != null && updated.getUser().getFullName() != null) {
            existing.getUser().setFullName(updated.getUser().getFullName());
            if (updated.getUser().getPhone() != null) {
                existing.getUser().setPhone(updated.getUser().getPhone());
            }
            userRepository.save(Objects.requireNonNull(existing.getUser()));
        }

        if (updated.getCollegeName() != null) existing.setCollegeName(updated.getCollegeName());
        if (updated.getUniversityName() != null) existing.setUniversityName(updated.getUniversityName());
        if (updated.getRollNumber() != null) existing.setRollNumber(updated.getRollNumber());
        if (updated.getEnrollmentNumber() != null) existing.setEnrollmentNumber(updated.getEnrollmentNumber());
        if (updated.getCurrentSemester() != null) existing.setCurrentSemester(updated.getCurrentSemester());
        if (updated.getCgpa() != null) existing.setCgpa(updated.getCgpa());
        if (updated.getTenthPercentage() != null) existing.setTenthPercentage(updated.getTenthPercentage());
        if (updated.getTwelfthPercentage() != null) existing.setTwelfthPercentage(updated.getTwelfthPercentage());
        if (updated.getGraduationPercentage() != null) existing.setGraduationPercentage(updated.getGraduationPercentage());
        if (updated.getActiveBacklogs() != null) existing.setActiveBacklogs(updated.getActiveBacklogs());
        if (updated.getGender() != null) existing.setGender(updated.getGender());
        if (updated.getDob() != null) existing.setDob(updated.getDob());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getCity() != null) existing.setCity(updated.getCity());
        if (updated.getState() != null) existing.setState(updated.getState());
        if (updated.getGithubUrl() != null) existing.setGithubUrl(updated.getGithubUrl());
        if (updated.getLinkedinUrl() != null) existing.setLinkedinUrl(updated.getLinkedinUrl());
        if (updated.getPortfolioUrl() != null) existing.setPortfolioUrl(updated.getPortfolioUrl());
        if (updated.getBio() != null) existing.setBio(updated.getBio());
        if (updated.getAchievements() != null) existing.setAchievements(updated.getAchievements());

        return studentProfileRepository.save(Objects.requireNonNull(existing));
    }

    public int calculateProfileCompletion(StudentProfile profile) {
        int score = 0;
        int max = 8;

        if (profile.getUser() != null && StringUtils.hasText(profile.getUser().getFullName())) score++;
        if (StringUtils.hasText(profile.getRollNumber())) score++;
        if (profile.getCgpa() != null && profile.getCgpa() > 0) score++;
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) score++;
        if (profile.getProjects() != null && !profile.getProjects().isEmpty()) score++;
        if (StringUtils.hasText(profile.getResumeUrl())) score++;
        if (StringUtils.hasText(profile.getLinkedinUrl()) || StringUtils.hasText(profile.getGithubUrl())) score++;
        if (profile.getDepartment() != null) score++;

        return (int) Math.round(((double) score / max) * 100);
    }

    @Transactional
    public StudentSkill addSkill(Long studentId, Long skillId, String skillName, String proficiency) {
        StudentProfile student = getProfileById(studentId);
        Skill skill;
        if (skillId != null) {
            skill = skillRepository.findById(skillId)
                    .orElseThrow(() -> new RuntimeException("Skill not found: " + skillId));
        } else if (skillName != null && !skillName.isBlank()) {
            String normalizedSkillName = skillName.trim();
            skill = skillRepository.findByNameIgnoreCase(normalizedSkillName)
                    .orElseGet(() -> skillRepository.save(Objects.requireNonNull(Skill.builder()
                            .name(normalizedSkillName)
                            .category("Technical")
                            .build())));
        } else {
            throw new IllegalArgumentException("A skill must be selected or entered.");
        }

        StudentSkill studentSkill = StudentSkill.builder()
                .student(student)
                .skill(skill)
                .proficiency(proficiency != null ? proficiency : "INTERMEDIATE")
                .build();

        StudentSkill savedSkill = studentSkillRepository.save(Objects.requireNonNull(studentSkill));
        if (student.getSkills() == null) {
            student.setSkills(new ArrayList<>());
        }
        student.getSkills().add(savedSkill);
        studentProfileRepository.save(Objects.requireNonNull(student));
        return savedSkill;
    }

    @Transactional
    public void removeSkill(Long studentSkillId) {
        StudentSkill studentSkill = studentSkillRepository.findById(Objects.requireNonNull(studentSkillId)).orElse(null);
        if (studentSkill != null && studentSkill.getStudent() != null) {
            StudentProfile student = studentSkill.getStudent();
            if (student.getSkills() != null) {
                student.getSkills().removeIf(skill -> Objects.equals(skill.getId(), studentSkillId));
                studentProfileRepository.save(Objects.requireNonNull(student));
            }
        }
        studentSkillRepository.deleteById(studentSkillId);
    }

    @Transactional
    public Project addProject(Long studentId, Project project) {
        StudentProfile student = getProfileById(studentId);
        project.setStudent(student);
        return projectRepository.save(Objects.requireNonNull(project));
    }

    @Transactional
    public void deleteProject(Long projectId) {
        projectRepository.deleteById(Objects.requireNonNull(projectId));
    }

    @Transactional
    public Certification addCertification(Long studentId, Certification certification) {
        StudentProfile student = getProfileById(studentId);
        certification.setStudent(student);
        return certificationRepository.save(Objects.requireNonNull(certification));
    }

    @Transactional
    public void deleteCertification(Long certId) {
        certificationRepository.deleteById(Objects.requireNonNull(certId));
    }

    @Transactional
    public Internship addInternship(Long studentId, Internship internship) {
        StudentProfile student = getProfileById(studentId);
        internship.setStudent(student);
        return internshipRepository.save(Objects.requireNonNull(internship));
    }

    @Transactional
    public void deleteInternship(Long internshipId) {
        internshipRepository.deleteById(Objects.requireNonNull(internshipId));
    }

    @Transactional
    public Resume saveResume(Long studentId, String fileName, String fileUrl) {
        StudentProfile student = getProfileById(studentId);
        int nextVersion = (student.getResumeVersion() != null ? student.getResumeVersion() : 0) + 1;

        Resume resume = Resume.builder()
                .student(student)
                .fileName(fileName)
                .fileUrl(fileUrl)
                .version(nextVersion)
                .isPrimary(true)
                .build();

        student.setResumeUrl(fileUrl);
        student.setResumeVersion(nextVersion);
        studentProfileRepository.save(Objects.requireNonNull(student));

        return resumeRepository.save(Objects.requireNonNull(resume));
    }

    public List<Resume> getStudentResumes(Long studentId) {
        return resumeRepository.findByStudentIdOrderByVersionDesc(studentId);
    }

    public List<Attendance> getStudentAttendance(Long studentId) {
        getProfileById(studentId);
        return attendanceRepository.findByStudentIdOrderByDateDesc(studentId);
    }

    public List<Assignment> getDepartmentAssignments(Long studentId) {
        StudentProfile student = getProfileById(studentId);
        if (student.getDepartment() == null || student.getDepartment().getId() == null) {
            return Collections.emptyList();
        }
        return assignmentRepository.findByDepartmentIdOrderByDueDateDesc(student.getDepartment().getId());
    }

    public List<StudyMaterial> getStudyMaterials(Long studentId) {
        getProfileById(studentId);
        return studyMaterialRepository.findAll();
    }

    public List<AssignmentSubmission> getStudentSubmissions(Long studentId) {
        getProfileById(studentId);
        return assignmentSubmissionRepository.findByStudentId(studentId);
    }

    @Transactional
    public AssignmentSubmission submitAssignment(Long studentId, Long assignmentId, String fileUrl, String comments) {
        getProfileById(studentId);
        return teacherService.submitAssignment(studentId, assignmentId, fileUrl, comments);
    }
}
