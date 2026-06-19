package com.arthas.musicschool.repository;

import com.arthas.musicschool.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByStudentIdOrderByReferenceMonthDesc(Long studentId);

    List<Payment> findByStatus(String status);

    @Query("SELECT p FROM Payment p WHERE p.referenceMonth = :month ORDER BY p.student.name")
    List<Payment> findByMonth(String month);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'Pago' AND p.referenceMonth = :month")
    Double sumPaidByMonth(String month);

    long countByStatus(String status);
}
