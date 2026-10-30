package com.cpm.service;

import com.cpm.dto.CandidateMatchDto;
import com.cpm.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CandidateMatchingServiceTest {

    private CandidateMatchingService matchingService;

    @BeforeEach
    void setUp() {
        matchingService = new CandidateMatchingService();
    }

    @Test
    void skillMatchingShouldNotMatchJavaWithJavaScript() {
        Department cse = Department.builder().code("CSE").name("Computer Science & Engineering").build();
        User user = User.builder().fullName("Alice Doe").email("alice@example.com").build();

        Skill jsSkill = Skill.builder().name("JavaScript").build();
        StudentSkill ss = StudentSkill.builder().skill(jsSkill).proficiency("ADVANCED").build();

        StudentProfile student = StudentProfile.builder()
                .user(user)
                .rollNumber("CSE101")
                .department(cse)
                .cgpa(8.5)
                .activeBacklogs(0)
                .skills(List.of(ss))
                .build();

        Job job = Job.builder()
                .title("Backend Java Developer")
                .requiredSkills("Java, Spring Boot")
                .minCgpa(7.0)
                .branch("CSE, IT")
                .build();

        CandidateMatchDto match = matchingService.matchCandidate(student, job);

        assertTrue(match.isEligible());
        assertFalse(match.getMatchedSkills().contains("Java"), "Java should not match with JavaScript");
        assertTrue(match.getMissingSkills().contains("Java"));
        assertTrue(match.getMissingSkills().contains("Spring Boot"));
        assertEquals(0, match.getSkillsScore());
    }

    @Test
    void skillMatchingShouldMatchExactNormalizedTokens() {
        Department cse = Department.builder().code("CSE").name("Computer Science & Engineering").build();
        User user = User.builder().fullName("Bob Smith").email("bob@example.com").build();

        Skill javaSkill = Skill.builder().name(" java ").build();
        Skill springSkill = Skill.builder().name("SPRING BOOT").build();

        StudentSkill ss1 = StudentSkill.builder().skill(javaSkill).proficiency("ADVANCED").build();
        StudentSkill ss2 = StudentSkill.builder().skill(springSkill).proficiency("INTERMEDIATE").build();

        StudentProfile student = StudentProfile.builder()
                .user(user)
                .rollNumber("CSE102")
                .department(cse)
                .cgpa(9.0)
                .activeBacklogs(0)
                .skills(List.of(ss1, ss2))
                .build();

        Job job = Job.builder()
                .title("Java Developer")
                .requiredSkills("Java, Spring Boot")
                .minCgpa(7.0)
                .branch("ALL")
                .build();

        CandidateMatchDto match = matchingService.matchCandidate(student, job);

        assertTrue(match.isEligible());
        assertTrue(match.getMatchedSkills().contains("Java"));
        assertTrue(match.getMatchedSkills().contains("Spring Boot"));
        assertTrue(match.getMissingSkills().isEmpty());
        assertEquals(40, match.getSkillsScore());
    }

    @Test
    void branchMatchingShouldHandleMultipleBranchesAndWhitespace() {
        Department ece = Department.builder().code("ECE").name("Electronics & Communication").build();
        Department mech = Department.builder().code("ME").name("Mechanical Engineering").build();

        User user1 = User.builder().fullName("Eve").email("eve@example.com").build();
        StudentProfile studentEce = StudentProfile.builder()
                .user(user1)
                .department(ece)
                .cgpa(8.0)
                .build();

        User user2 = User.builder().fullName("Frank").email("frank@example.com").build();
        StudentProfile studentMech = StudentProfile.builder()
                .user(user2)
                .department(mech)
                .cgpa(8.0)
                .build();

        Job job = Job.builder()
                .title("Embedded Software Engineer")
                .requiredSkills("C, Embedded Systems")
                .branch("CSE, IT, ECE")
                .build();

        CandidateMatchDto matchEce = matchingService.matchCandidate(studentEce, job);
        assertTrue(matchEce.isEligible(), "ECE candidate should be eligible for 'CSE, IT, ECE'");

        CandidateMatchDto matchMech = matchingService.matchCandidate(studentMech, job);
        assertFalse(matchMech.isEligible(), "Mechanical candidate should not be eligible for 'CSE, IT, ECE'");
    }

    @Test
    void scoreCalculationShouldRemainBoundedBetween0And100() {
        Department cse = Department.builder().code("CSE").name("Computer Science").build();
        User user = User.builder().fullName("Grace").email("grace@example.com").build();

        Project p1 = Project.builder().title("Proj 1").build();
        Project p2 = Project.builder().title("Proj 2").build();
        Project p3 = Project.builder().title("Proj 3").build();
        Project p4 = Project.builder().title("Proj 4").build();

        Certification c1 = Certification.builder().title("Cert 1").issuer("AWS").build();
        Certification c2 = Certification.builder().title("Cert 2").issuer("Oracle").build();
        Certification c3 = Certification.builder().title("Cert 3").issuer("Google").build();

        Internship i1 = Internship.builder().companyName("Comp 1").build();
        Internship i2 = Internship.builder().companyName("Comp 2").build();

        StudentProfile student = StudentProfile.builder()
                .user(user)
                .department(cse)
                .cgpa(10.0)
                .activeBacklogs(0)
                .projects(List.of(p1, p2, p3, p4))
                .certifications(List.of(c1, c2, c3))
                .internships(List.of(i1, i2))
                .build();

        Job job = Job.builder()
                .title("Software Engineer")
                .requiredSkills("") // default baseline 35
                .build();

        CandidateMatchDto match = matchingService.matchCandidate(student, job);

        assertTrue(match.getOverallMatchPercentage() >= 0 && match.getOverallMatchPercentage() <= 100);
        assertEquals(25, match.getAcademicsScore());
        assertEquals(20, match.getProjectsScore());
        assertEquals(15, match.getCertificationsScore());
        assertEquals(35, match.getSkillsScore());
        assertEquals(95, match.getOverallMatchPercentage());
    }
}
