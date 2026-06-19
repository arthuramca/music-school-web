package com.arthas.musicschool.service;

import com.arthas.musicschool.model.Lesson;
import com.arthas.musicschool.model.Student;
import com.arthas.musicschool.repository.LessonRepository;
import com.arthas.musicschool.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepo;
    private final StudentRepository studentRepo;

    public List<Lesson> findByStudent(Long studentId) {
        return lessonRepo.findByStudentIdOrderByLessonDateDesc(studentId);
    }

    public List<Lesson> findByRange(LocalDate from, LocalDate to) {
        return lessonRepo.findByLessonDateBetweenOrderByLessonDate(from, to);
    }

    @Transactional
    public Lesson save(Long studentId, Lesson lesson) {
        Student student = studentRepo.findById(studentId).orElseThrow();
        lesson.setStudent(student);
        if (lesson.getLessonDate() == null) lesson.setLessonDate(LocalDate.now());
        return lessonRepo.save(lesson);
    }

    @Transactional
    public Lesson update(Long id, Lesson updated) {
        Lesson existing = lessonRepo.findById(id).orElseThrow();
        existing.setLessonDate(updated.getLessonDate());
        existing.setAttended(updated.getAttended());
        existing.setNotes(updated.getNotes());
        return lessonRepo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        lessonRepo.deleteById(id);
    }

    public Map<String, Long> studentStats(Long studentId) {
        long total    = lessonRepo.countByStudentId(studentId);
        long attended = lessonRepo.countByStudentIdAndAttended(studentId, true);
        return Map.of("total", total, "attended", attended, "missed", total - attended);
    }
}
