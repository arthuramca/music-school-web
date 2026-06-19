package com.arthas.musicschool.repository;

import com.arthas.musicschool.model.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaitlistRepository extends JpaRepository<WaitlistEntry, Long> {
    List<WaitlistEntry> findAllByOrderByRequestDateAsc();
    List<WaitlistEntry> findByStatus(String status);
    List<WaitlistEntry> findByInstrument(String instrument);
}
