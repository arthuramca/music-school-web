package com.arthas.musicschool.controller;

import com.arthas.musicschool.dto.StudentDTO;
import com.arthas.musicschool.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService service;

    @GetMapping
    public List<StudentDTO> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String instrument) {
        return service.search(q, status, instrument);
    }

    @GetMapping("/{id}")
    public StudentDTO get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public StudentDTO create(@RequestBody StudentDTO dto) {
        dto.setId(null);
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public StudentDTO update(@PathVariable Long id, @RequestBody StudentDTO dto) {
        dto.setId(id);
        return service.save(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/slot")
    public List<StudentDTO> bySlot(@RequestParam String day, @RequestParam String time) {
        return service.findBySlot(day, time);
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return service.stats();
    }

    @GetMapping("/instruments")
    public List<String> instruments() {
        return service.instruments();
    }
}
