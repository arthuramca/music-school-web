package com.arthas.musicschool.service;

import com.arthas.musicschool.dto.StudentDTO;
import com.arthas.musicschool.model.Student;
import com.arthas.musicschool.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpreadsheetService {

    private final StudentRepository repo;

    private static final String[] HEADERS = {
        "ID", "Nome", "CPF", "Nascimento", "Telefone", "Email", "Endereço",
        "Instrumento", "Instrumento 2", "Nível", "Professor",
        "Início", "Mensalidade", "Venc.", "Status",
        "Dia Aula", "Hora Aula", "Dia Aula 2", "Hora Aula 2", "Observações"
    };

    public byte[] exportAll() throws IOException {
        List<Student> students = repo.findAllByOrderByNameAsc();
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("Alunos");

            CellStyle headerStyle = wb.createCellStyle();
            Font font = wb.createFont();
            font.setBold(true);
            font.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(font);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row header = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                Cell c = header.createCell(i);
                c.setCellValue(HEADERS[i]);
                c.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5000);
            }

            int row = 1;
            for (Student s : students) {
                Row r = sheet.createRow(row++);
                r.createCell(0).setCellValue(s.getId());
                r.createCell(1).setCellValue(s.getName());
                r.createCell(2).setCellValue(str(s.getCpf()));
                r.createCell(3).setCellValue(str(s.getBirthDate()));
                r.createCell(4).setCellValue(str(s.getPhone()));
                r.createCell(5).setCellValue(str(s.getEmail()));
                r.createCell(6).setCellValue(str(s.getAddress()));
                r.createCell(7).setCellValue(str(s.getInstrument()));
                r.createCell(8).setCellValue(str(s.getInstrument2()));
                r.createCell(9).setCellValue(str(s.getLevel()));
                r.createCell(10).setCellValue(str(s.getTeacher()));
                r.createCell(11).setCellValue(str(s.getStartDate()));
                r.createCell(12).setCellValue(s.getMonthlyFee() != null ? s.getMonthlyFee() : 0);
                r.createCell(13).setCellValue(s.getPaymentDueDay() != null ? s.getPaymentDueDay() : 0);
                r.createCell(14).setCellValue(str(s.getStatus()));
                r.createCell(15).setCellValue(str(s.getLessonDay()));
                r.createCell(16).setCellValue(str(s.getLessonTime()));
                r.createCell(17).setCellValue(str(s.getLessonDay2()));
                r.createCell(18).setCellValue(str(s.getLessonTime2()));
                r.createCell(19).setCellValue(str(s.getNotes()));
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            wb.write(out);
            return out.toByteArray();
        }
    }

    @Transactional
    public int importFromFile(MultipartFile file) throws IOException {
        int count = 0;
        try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || cell(row, 1).isBlank()) continue;
                Student s = new Student();
                s.setName(cell(row, 1));
                s.setCpf(cell(row, 2));
                s.setPhone(cell(row, 4));
                s.setEmail(cell(row, 5));
                s.setAddress(cell(row, 6));
                s.setInstrument(cell(row, 7));
                s.setInstrument2(cell(row, 8));
                s.setLevel(cell(row, 9));
                s.setTeacher(cell(row, 10));
                s.setStatus(cell(row, 14).isBlank() ? "Ativo" : cell(row, 14));
                s.setLessonDay(cell(row, 15));
                s.setLessonTime(cell(row, 16));
                s.setLessonDay2(cell(row, 17));
                s.setLessonTime2(cell(row, 18));
                s.setNotes(cell(row, 19));
                repo.save(s);
                count++;
            }
        }
        return count;
    }

    private String str(Object v) { return v != null ? v.toString() : ""; }

    private String cell(Row row, int col) {
        Cell c = row.getCell(col);
        if (c == null) return "";
        return switch (c.getCellType()) {
            case STRING  -> c.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) c.getNumericCellValue());
            case BOOLEAN -> String.valueOf(c.getBooleanCellValue());
            default -> "";
        };
    }
}
