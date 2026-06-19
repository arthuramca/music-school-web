package com.arthas.musicschool.service;

import com.arthas.musicschool.model.WaitlistEntry;
import com.arthas.musicschool.repository.WaitlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WaitlistService {

    private final WaitlistRepository repo;

    public List<WaitlistEntry> findAll() {
        return repo.findAllByOrderByRequestDateAsc();
    }

    public List<WaitlistEntry> findByStatus(String status) {
        return repo.findByStatus(status);
    }

    @Transactional
    public WaitlistEntry save(WaitlistEntry entry) {
        if (entry.getRequestDate() == null) entry.setRequestDate(LocalDate.now());
        return repo.save(entry);
    }

    @Transactional
    public WaitlistEntry updateStatus(Long id, String status) {
        WaitlistEntry entry = repo.findById(id).orElseThrow();
        entry.setStatus(status);
        return repo.save(entry);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
