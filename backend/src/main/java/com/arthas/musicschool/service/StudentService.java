package com.arthas.musicschool.service;

import com.arthas.musicschool.dto.StudentDTO;
import com.arthas.musicschool.model.Student;
import com.arthas.musicschool.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository repo;

    public List<StudentDTO> findAll() {
        return repo.findAllByOrderByNameAsc().stream().map(StudentDTO::from).toList();
    }

    public List<StudentDTO> search(String q, String status, String instrument) {
        List<Student> list = (q != null && !q.isBlank()) ? repo.search(q) : repo.findAllByOrderByNameAsc();
        return list.stream()
                .filter(s -> status == null || status.equals("Todos") || s.getStatus().equals(status))
                .filter(s -> instrument == null || instrument.equals("Todos") || instrument.equals(s.getInstrument()))
                .map(StudentDTO::from)
                .toList();
    }

    public StudentDTO findById(Long id) {
        return repo.findById(id).map(StudentDTO::from).orElseThrow();
    }

    @Transactional
    public StudentDTO save(StudentDTO dto) {
        Student s = (dto.getId() != null) ? repo.findById(dto.getId()).orElseThrow() : new Student();
        applyDto(s, dto);
        return StudentDTO.from(repo.save(s));
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<StudentDTO> findBySlot(String day, String time) {
        return repo.findByAnySlot(day, time).stream()
                .filter(s -> "Ativo".equals(s.getStatus()))
                .map(StudentDTO::from).toList();
    }

    public Map<String, Long> stats() {
        return Map.of(
                "total",    repo.count(),
                "ativos",   repo.countByStatus("Ativo"),
                "inativos", repo.countByStatus("Inativo"),
                "trancados", repo.countByStatus("Trancado")
        );
    }

    public List<String> instruments() {
        return repo.findDistinctInstruments();
    }

    private void applyDto(Student s, StudentDTO dto) {
        s.setName(dto.getName());
        s.setCpf(dto.getCpf());
        s.setBirthDate(dto.getBirthDate());
        s.setPhone(dto.getPhone());
        s.setEmail(dto.getEmail());
        s.setAddress(dto.getAddress());
        s.setInstrument(dto.getInstrument());
        s.setInstrument2(dto.getInstrument2());
        s.setLevel(dto.getLevel());
        s.setTeacher(dto.getTeacher());
        s.setStartDate(dto.getStartDate());
        s.setMonthlyFee(dto.getMonthlyFee());
        s.setPaymentDueDay(dto.getPaymentDueDay());
        s.setStatus(dto.getStatus() != null ? dto.getStatus() : "Ativo");
        s.setNotes(dto.getNotes());
        s.setLessonDay(dto.getLessonDay());
        s.setLessonTime(dto.getLessonTime());
        s.setLessonDay2(dto.getLessonDay2());
        s.setLessonTime2(dto.getLessonTime2());
        if (dto.getMakeupPending() != null) s.setMakeupPending(dto.getMakeupPending());
    }
}
