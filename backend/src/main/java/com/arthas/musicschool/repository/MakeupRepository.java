package com.arthas.musicschool.repository;

import com.arthas.musicschool.model.Makeup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MakeupRepository extends JpaRepository<Makeup, Long> {

    List<Makeup> findByStudentIdOrderByScheduledDateAsc(Long studentId);

    List<Makeup> findByStatus(String status);

    List<Makeup> findByDayOfWeekAndSlotTime(String dayOfWeek, String slotTime);
}
