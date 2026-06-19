package com.arthas.musicschool.controller;

import com.arthas.musicschool.model.Lesson;
import com.arthas.musicschool.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService service;

    @GetMapping("/students/{studentId}/lessons")
    public List<Lesson> byStudent(@PathVariable Long studentId) {
        return service.findByStudent(studentId);
    }

    @GetMapping("/students/{studentId}/lessons/stats")
    public Map<String, Long> stats(@PathVariable Long studentId) {
        return service.studentStats(studentId);
    }

    @PostMapping("/students/{studentId}/lessons")
    public Lesson create(@PathVariable Long studentId, @RequestBody Lesson lesson) {
        return service.save(studentId, lesson);
    }

    @PutMapping("/lessons/{id}")
    public Lesson update(@PathVariable Long id, @RequestBody Lesson lesson) {
        return service.update(id, lesson);
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
