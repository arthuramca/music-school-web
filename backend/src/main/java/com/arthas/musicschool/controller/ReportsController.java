package com.arthas.musicschool.controller;

import com.arthas.musicschool.repository.LessonRepository;
import com.arthas.musicschool.repository.PaymentRepository;
import com.arthas.musicschool.repository.StudentRepository;
import com.arthas.musicschool.service.PdfService;
import com.arthas.musicschool.service.SpreadsheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final StudentRepository studentRepo;
    private final PaymentRepository paymentRepo;
    private final LessonRepository lessonRepo;
    private final SpreadsheetService spreadsheetService;
    private final PdfService pdfService;

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        long total    = studentRepo.count();
        long ativos   = studentRepo.countByStatus("Ativo");
        long inativos = studentRepo.countByStatus("Inativo");
        long trancados= studentRepo.countByStatus("Trancado");
        long pendente = paymentRepo.countByStatus("Pendente");
        long pago     = paymentRepo.countByStatus("Pago");

        String thisMonth = LocalDate.now().getYear() + "-" + String.format("%02d", LocalDate.now().getMonthValue());
        Double received  = paymentRepo.sumPaidByMonth(thisMonth);

        List<Map<String, Object>> byInstrument = studentRepo.findDistinctInstruments().stream()
                .map(i -> Map.<String, Object>of(
                        "instrument", i,
                        "count", studentRepo.findByStatus("Ativo").stream()
                                .filter(s -> i.equals(s.getInstrument())).count()))
                .toList();

        return Map.of(
                "totalStudents",    total,
                "activeStudents",   ativos,
                "inactiveStudents", inativos,
                "lockedStudents",   trancados,
                "pendingPayments",  pendente,
                "paidPayments",     pago,
                "receivedThisMonth", received != null ? received : 0.0,
                "byInstrument",     byInstrument
        );
    }

    @GetMapping("/export/xlsx")
    public ResponseEntity<byte[]> exportXlsx() throws Exception {
        byte[] data = spreadsheetService.exportAll();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=alunos.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }

    @PostMapping("/import/xlsx")
    public Map<String, Object> importXlsx(@RequestParam("file") MultipartFile file) throws Exception {
        int count = spreadsheetService.importFromFile(file);
        return Map.of("imported", count);
    }

    @GetMapping("/students/{id}/pdf")
    public ResponseEntity<byte[]> studentPdf(@PathVariable Long id) throws Exception {
        byte[] data = pdfService.generateStudentReport(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=aluno-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }
}
