package com.arthas.musicschool.service;

import com.arthas.musicschool.model.Lesson;
import com.arthas.musicschool.model.Makeup;
import com.arthas.musicschool.model.Student;
import com.arthas.musicschool.repository.LessonRepository;
import com.arthas.musicschool.repository.MakeupRepository;
import com.arthas.musicschool.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MakeupService {

    private final MakeupRepository makeupRepo;
    private final StudentRepository studentRepo;
    private final LessonRepository lessonRepo;

    public List<Makeup> findByStudent(Long studentId) {
        return makeupRepo.findByStudentIdOrderByScheduledDateAsc(studentId);
    }

    public List<Makeup> findPending() {
        return makeupRepo.findByStatus("Pendente");
    }

    @Transactional
    public Makeup schedule(Long studentId, Makeup makeup) {
        Student student = studentRepo.findById(studentId).orElseThrow();
        makeup.setStudent(student);
        makeup.setStatus("Pendente");
        student.setMakeupPending(student.getMakeupPending() + 1);
        studentRepo.save(student);
        return makeupRepo.save(makeup);
    }

    @Transactional
    public Lesson confirmPresence(Long makeupId) {
        Makeup makeup = makeupRepo.findById(makeupId).orElseThrow();
        makeup.setStatus("Realizada");
        makeupRepo.save(makeup);

        Student student = makeup.getStudent();
        student.setMakeupPending(Math.max(0, student.getMakeupPending() - 1));
        studentRepo.save(student);

        Lesson lesson = Lesson.builder()
                .student(student)
                .lessonDate(makeup.getScheduledDate() != null ? makeup.getScheduledDate() : LocalDate.now())
                .attended(true)
                .notes("Reposição")
                .build();
        return lessonRepo.save(lesson);
    }

    @Transactional
    public void cancel(Long makeupId) {
        Makeup makeup = makeupRepo.findById(makeupId).orElseThrow();
        Student student = makeup.getStudent();
        student.setMakeupPending(Math.max(0, student.getMakeupPending() - 1));
        studentRepo.save(student);
        makeupRepo.deleteById(makeupId);
    }
}
