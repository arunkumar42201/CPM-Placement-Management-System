package com.cpm.service;

import com.cpm.entity.Skill;
import com.cpm.entity.Role;
import com.cpm.entity.StudentProfile;
import com.cpm.entity.StudentSkill;
import com.cpm.entity.User;
import com.cpm.repository.SkillRepository;
import com.cpm.repository.StudentProfileRepository;
import com.cpm.repository.StudentSkillRepository;
import com.cpm.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentServiceSkillTest {

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private StudentSkillRepository studentSkillRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    @SuppressWarnings("null")
    void addSkillPersistsStudentSkillReferenceOnStudentProfile() {
        StudentProfile student = StudentProfile.builder()
                .id(1L)
                .skills(new ArrayList<>())
                .build();
        Skill skill = Skill.builder().id(2L).name("Java").build();
        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(student));
        when(skillRepository.findById(2L)).thenReturn(Optional.of(skill));
        when(studentSkillRepository.save(any(StudentSkill.class))).thenAnswer(invocation -> {
            StudentSkill savedSkill = invocation.getArgument(0);
            savedSkill.setId(3L);
            return savedSkill;
        });

        StudentSkill savedSkill = studentService.addSkill(1L, 2L, null, "ADVANCED");

        assertEquals(List.of(savedSkill), student.getSkills());
        assertSame(skill, savedSkill.getSkill());
        assertEquals("ADVANCED", savedSkill.getProficiency());
        verify(studentProfileRepository).save(student);
    }

    @Test
    @SuppressWarnings("null")
    void addSkillCreatesCatalogEntryWhenStudentEntersNewSkill() {
        StudentProfile student = StudentProfile.builder()
                .id(1L)
                .skills(new ArrayList<>())
                .build();
        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(student));
        when(skillRepository.findByNameIgnoreCase("Kotlin")).thenReturn(Optional.empty());
        when(skillRepository.save(any(Skill.class))).thenAnswer(invocation -> {
            Skill savedSkill = invocation.getArgument(0);
            savedSkill.setId(2L);
            return savedSkill;
        });
        when(studentSkillRepository.save(any(StudentSkill.class))).thenAnswer(invocation -> {
            StudentSkill savedSkill = invocation.getArgument(0);
            savedSkill.setId(3L);
            return savedSkill;
        });

        StudentSkill savedSkill = studentService.addSkill(1L, null, " Kotlin ", "BEGINNER");

        assertEquals("Kotlin", savedSkill.getSkill().getName());
        assertEquals("Technical", savedSkill.getSkill().getCategory());
        assertEquals(List.of(savedSkill), student.getSkills());
        verify(skillRepository).save(any(Skill.class));
        verify(studentProfileRepository).save(student);
    }

    @Test
    void removeSkillRemovesStudentProfileReferenceAndDocument() {
        StudentProfile student = StudentProfile.builder()
                .id(1L)
                .skills(new ArrayList<>())
                .build();
        StudentSkill studentSkill = StudentSkill.builder()
                .id(3L)
                .student(student)
                .skill(Skill.builder().id(2L).name("Java").build())
                .build();
        student.getSkills().add(studentSkill);
        when(studentSkillRepository.findById(3L)).thenReturn(Optional.of(studentSkill));

        studentService.removeSkill(3L);

        assertEquals(0, student.getSkills().size());
        verify(studentProfileRepository).save(student);
        verify(studentSkillRepository).deleteById(3L);
    }

    @Test
    @SuppressWarnings("null")
    void getOrCreateProfileCreatesMissingStudentProfile() {
        User user = User.builder().id(13L).role(Role.STUDENT).build();
        when(studentProfileRepository.findByUserId(13L)).thenReturn(Optional.empty());
        when(userRepository.findById(13L)).thenReturn(Optional.of(user));
        when(studentProfileRepository.save(any(StudentProfile.class))).thenAnswer(invocation -> {
            StudentProfile savedProfile = invocation.getArgument(0);
            savedProfile.setId(21L);
            return savedProfile;
        });

        StudentProfile profile = studentService.getOrCreateProfileByUserId(13L);

        assertEquals(21L, profile.getId());
        assertSame(user, profile.getUser());
        assertEquals("CPM13", profile.getRollNumber());
        assertEquals("ENR13", profile.getEnrollmentNumber());
        assertEquals(0.0, profile.getCgpa());
        verify(studentProfileRepository).save(any(StudentProfile.class));
    }
}
