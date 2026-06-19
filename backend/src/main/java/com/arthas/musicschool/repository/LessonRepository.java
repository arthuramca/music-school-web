package com.arthas.musicschool.repository;

import com.arthas.musicschool.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByStudentIdOrderByLessonDateDesc(Long studentId);

    List<Lesson> findByLessonDateBetweenOrderByLessonDate(LocalDate from, LocalDate to);

    long countByStudentId(Long studentId);

    long countByStudentIdAndAttended(Long studentId, Boolean attended);
}
