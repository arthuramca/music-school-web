package com.arthas.musicschool.controller;

import com.arthas.musicschool.model.Lesson;
import com.arthas.musicschool.model.Makeup;
import com.arthas.musicschool.service.MakeupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MakeupController {

    private final MakeupService service;

    @GetMapping("/students/{studentId}/makeups")
    public List<Makeup> byStudent(@PathVariable Long studentId) {
        return service.findByStudent(studentId);
    }

    @GetMapping("/makeups/pending")
    public List<Makeup> pending() {
        return service.findPending();
    }

    @PostMapping("/students/{studentId}/makeups")
    public Makeup schedule(@PathVariable Long studentId, @RequestBody Makeup makeup) {
        return service.schedule(studentId, makeup);
    }

    @PostMapping("/makeups/{id}/confirm")
    public Lesson confirm(@PathVariable Long id) {
        return service.confirmPresence(id);
    }

    @DeleteMapping("/makeups/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        service.cancel(id);
        return ResponseEntity.noContent().build();
    }
}
