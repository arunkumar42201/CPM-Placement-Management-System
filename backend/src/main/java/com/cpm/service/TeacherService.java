package com.cpm.service;

import com.cpm.entity.*;
import com.cpm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class TeacherService {

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentSubmissionRepository assignmentSubmissionRepository;

    @Autowired
    private StudyMaterialRepository studyMaterialRepository;

    @Autowired
    private NotificationService notificationService;

    public TeacherProfile getProfileByUserId(Long userId) {
        return teacherProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found for user ID: " + userId));
    }

    public List<StudentProfile> getDepartmentStudents(Long departmentId) {
        return studentProfileRepository.findByDepartmentId(departmentId);
    }

    @Transactional
    public Attendance recordAttendance(Long teacherId, Long studentId, Long courseId, String subjectName, LocalDate date, String status) {
        TeacherProfile teacher = teacherProfileRepository.findById(Objects.requireNonNull(teacherId)).orElse(null);
        StudentProfile student = studentProfileRepository.findById(Objects.requireNonNull(studentId))
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        Attendance record = Attendance.builder()
                .teacher(teacher)
                .student(student)
                .subjectName(subjectName)
                .date(date != null ? date : LocalDate.now())
                .status(status != null ? status : "PRESENT")
                .build();

        return attendanceRepository.save(Objects.requireNonNull(record));
    }

    public List<Attendance> getStudentAttendance(Long studentId) {
        return attendanceRepository.findByStudentIdOrderByDateDesc(studentId);
    }

    @Transactional
    public Assignment createAssignment(Long teacherId, Assignment assignment) {
        TeacherProfile teacher = teacherProfileRepository.findById(Objects.requireNonNull(teacherId))
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + teacherId));

        assignment.setTeacher(teacher);
        assignment.setDepartment(teacher.getDepartment());
        Assignment saved = assignmentRepository.save(Objects.requireNonNull(assignment));

        // Notify department students
        if (teacher.getDepartment() != null) {
            List<StudentProfile> students = studentProfileRepository.findByDepartmentId(teacher.getDepartment().getId());
            for (StudentProfile s : students) {
                notificationService.createNotification(
                        s.getUser(),
                        "New Assignment: " + assignment.getTitle(),
                        "Assignment posted by " + teacher.getUser().getFullName() + " (Due: " + assignment.getDueDate() + ")",
                        "ASSIGNMENT",
                        "/student/academics"
                );
            }
        }

        return saved;
    }

    public List<Assignment> getTeacherAssignments(Long teacherId) {
        return assignmentRepository.findByTeacherIdOrderByDueDateDesc(teacherId);
    }

    public List<Assignment> getDepartmentAssignments(Long departmentId) {
        return assignmentRepository.findByDepartmentIdOrderByDueDateDesc(departmentId);
    }

    @Transactional
    public AssignmentSubmission submitAssignment(Long studentId, Long assignmentId, String fileUrl, String comments) {
        StudentProfile student = studentProfileRepository.findById(Objects.requireNonNull(studentId))
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
        Assignment assignment = assignmentRepository.findById(Objects.requireNonNull(assignmentId))
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));

        AssignmentSubmission submission = assignmentSubmissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId)
                .orElse(AssignmentSubmission.builder()
                        .assignment(assignment)
                        .student(student)
                        .build());

        submission.setSubmissionFileUrl(fileUrl);
        submission.setComments(comments);
        submission.setStatus("SUBMITTED");

        return assignmentSubmissionRepository.save(Objects.requireNonNull(submission));
    }

    @Transactional
    public AssignmentSubmission gradeSubmission(Long submissionId, Integer marks, String feedback) {
        AssignmentSubmission submission = assignmentSubmissionRepository.findById(Objects.requireNonNull(submissionId))
                .orElseThrow(() -> new RuntimeException("Submission not found: " + submissionId));

        submission.setMarksAwarded(marks);
        submission.setFeedback(feedback);
        submission.setStatus("GRADED");

        submission = assignmentSubmissionRepository.save(Objects.requireNonNull(submission));

        notificationService.createNotification(
                submission.getStudent().getUser(),
                "Assignment Graded: " + submission.getAssignment().getTitle(),
                "You scored " + marks + "/" + submission.getAssignment().getMaxMarks() + ". Feedback: " + feedback,
                "ASSIGNMENT",
                "/student/academics"
        );

        return submission;
    }

    public List<AssignmentSubmission> getAssignmentSubmissions(Long assignmentId) {
        return assignmentSubmissionRepository.findByAssignmentId(assignmentId);
    }

    public List<AssignmentSubmission> getStudentSubmissions(Long studentId) {
        return assignmentSubmissionRepository.findByStudentId(studentId);
    }

    @Transactional
    public StudyMaterial uploadStudyMaterial(Long teacherId, StudyMaterial material) {
        TeacherProfile teacher = teacherProfileRepository.findById(Objects.requireNonNull(teacherId))
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + teacherId));

        material.setTeacher(teacher);
        return studyMaterialRepository.save(Objects.requireNonNull(material));
    }

    public List<StudyMaterial> getAllStudyMaterials() {
        return studyMaterialRepository.findAll();
    }
}
