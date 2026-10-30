package com.cpm.repository;

import com.cpm.entity.StudyMaterial;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyMaterialRepository extends MongoRepository<StudyMaterial, Long> {
    @Query(value = "{'teacher': ?0}", sort = "{'uploadedAt': -1}")
    List<StudyMaterial> findByTeacherIdOrderByUploadedAtDesc(Long teacherId);
    List<StudyMaterial> findByCategory(String category);
}
