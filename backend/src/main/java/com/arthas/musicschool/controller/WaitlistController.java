package com.arthas.musicschool.controller;

import com.arthas.musicschool.model.WaitlistEntry;
import com.arthas.musicschool.service.WaitlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/waitlist")
@RequiredArgsConstructor
public class WaitlistController {

    private final WaitlistService service;

    @GetMapping
    public List<WaitlistEntry> list(@RequestParam(required = false) String status) {
        return status != null ? service.findByStatus(status) : service.findAll();
    }

    @PostMapping
    public WaitlistEntry create(@RequestBody WaitlistEntry entry) {
        entry.setId(null);
        return service.save(entry);
    }

    @PutMapping("/{id}")
    public WaitlistEntry update(@PathVariable Long id, @RequestBody WaitlistEntry entry) {
        entry.setId(id);
        return service.save(entry);
    }

    @PatchMapping("/{id}/status")
    public WaitlistEntry updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.updateStatus(id, body.get("status"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
