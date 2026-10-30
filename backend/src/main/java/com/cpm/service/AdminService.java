package com.cpm.service;

import com.cpm.entity.*;
import com.cpm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private SkillRepository skillRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setActive(!user.isActive());
        return userRepository.save(Objects.requireNonNull(user));
    }

    @Transactional
    public Department createDepartment(Department dept) {
        return departmentRepository.save(Objects.requireNonNull(dept));
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Transactional
    public Course createCourse(Long departmentId, Course course) {
        Department dept = departmentRepository.findById(Objects.requireNonNull(departmentId))
                .orElseThrow(() -> new RuntimeException("Department not found: " + departmentId));
        course.setDepartment(dept);
        return courseRepository.save(Objects.requireNonNull(course));
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Transactional
    public Batch createBatch(Long departmentId, Batch batch) {
        if (departmentId != null) {
            Department dept = departmentRepository.findById(departmentId).orElse(null);
            batch.setDepartment(dept);
        }
        return batchRepository.save(Objects.requireNonNull(batch));
    }

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Transactional
    public Skill createSkill(Skill skill) {
        return skillRepository.save(Objects.requireNonNull(skill));
    }
}
