package com.arthas.musicschool.service;

import com.arthas.musicschool.model.Payment;
import com.arthas.musicschool.model.Student;
import com.arthas.musicschool.repository.PaymentRepository;
import com.arthas.musicschool.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository repo;
    private final StudentRepository studentRepo;

    public List<Payment> findByStudent(Long studentId) {
        return repo.findByStudentIdOrderByReferenceMonthDesc(studentId);
    }

    public List<Payment> findByMonth(String month) {
        return repo.findByMonth(month);
    }

    @Transactional
    public Payment save(Long studentId, Payment payment) {
        Student student = studentRepo.findById(studentId).orElseThrow();
        payment.setStudent(student);
        return repo.save(payment);
    }

    @Transactional
    public Payment update(Long id, Payment updated) {
        Payment existing = repo.findById(id).orElseThrow();
        existing.setReferenceMonth(updated.getReferenceMonth());
        existing.setAmount(updated.getAmount());
        existing.setPaidDate(updated.getPaidDate());
        existing.setStatus(updated.getStatus());
        existing.setNotes(updated.getNotes());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Map<String, Object> monthSummary(String month) {
        List<Payment> payments = repo.findByMonth(month);
        long paid    = payments.stream().filter(p -> "Pago".equals(p.getStatus())).count();
        long pending = payments.stream().filter(p -> "Pendente".equals(p.getStatus())).count();
        Double total = repo.sumPaidByMonth(month);
        return Map.of("paid", paid, "pending", pending, "totalReceived", total != null ? total : 0.0);
    }
}
