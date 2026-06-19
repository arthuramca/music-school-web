package com.arthas.musicschool.controller;

import com.arthas.musicschool.model.Payment;
import com.arthas.musicschool.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @GetMapping("/students/{studentId}/payments")
    public List<Payment> byStudent(@PathVariable Long studentId) {
        return service.findByStudent(studentId);
    }

    @PostMapping("/students/{studentId}/payments")
    public Payment create(@PathVariable Long studentId, @RequestBody Payment payment) {
        return service.save(studentId, payment);
    }

    @PutMapping("/payments/{id}")
    public Payment update(@PathVariable Long id, @RequestBody Payment payment) {
        return service.update(id, payment);
    }

    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/payments/month/{month}")
    public List<Payment> byMonth(@PathVariable String month) {
        return service.findByMonth(month);
    }

    @GetMapping("/payments/month/{month}/summary")
    public Map<String, Object> summary(@PathVariable String month) {
        return service.monthSummary(month);
    }
}
