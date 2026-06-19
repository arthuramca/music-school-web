package com.arthas.musicschool.service;

import com.arthas.musicschool.model.Lesson;
import com.arthas.musicschool.model.Payment;
import com.arthas.musicschool.model.Student;
import com.arthas.musicschool.repository.LessonRepository;
import com.arthas.musicschool.repository.PaymentRepository;
import com.arthas.musicschool.repository.StudentRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final StudentRepository studentRepo;
    private final PaymentRepository paymentRepo;
    private final LessonRepository lessonRepo;

    public byte[] generateStudentReport(Long studentId) throws Exception {
        Student s = studentRepo.findById(studentId).orElseThrow();
        List<Payment> payments = paymentRepo.findByStudentIdOrderByReferenceMonthDesc(studentId);
        List<Lesson> lessons   = lessonRepo.findByStudentIdOrderByLessonDateDesc(studentId);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 40, 40, 60, 40);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.decode("#2c3e50"));
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.decode("#2c3e50"));

            doc.add(new Paragraph("Music School", titleFont));
            doc.add(new Paragraph("Ficha do Aluno", FontFactory.getFont(FontFactory.HELVETICA, 11, Color.GRAY)));
            doc.add(Chunk.NEWLINE);

            addSection(doc, "Dados Pessoais", sectionFont);
            addField(doc, "Nome",       s.getName(), labelFont, bodyFont);
            addField(doc, "CPF",        s.getCpf(), labelFont, bodyFont);
            addField(doc, "Telefone",   s.getPhone(), labelFont, bodyFont);
            addField(doc, "Email",      s.getEmail(), labelFont, bodyFont);
            addField(doc, "Endereço",   s.getAddress(), labelFont, bodyFont);

            doc.add(Chunk.NEWLINE);
            addSection(doc, "Dados da Aula", sectionFont);
            addField(doc, "Instrumento", s.getInstrument(), labelFont, bodyFont);
            addField(doc, "Nível",       s.getLevel(), labelFont, bodyFont);
            addField(doc, "Professor",   s.getTeacher(), labelFont, bodyFont);
            addField(doc, "Dia/Hora",    s.getLessonDay() + " " + s.getLessonTime(), labelFont, bodyFont);
            addField(doc, "Status",      s.getStatus(), labelFont, bodyFont);
            addField(doc, "Mensalidade", s.getMonthlyFee() != null ? "R$ " + String.format("%.2f", s.getMonthlyFee()) : "-", labelFont, bodyFont);

            doc.add(Chunk.NEWLINE);
            addSection(doc, "Histórico de Pagamentos", sectionFont);
            if (payments.isEmpty()) {
                doc.add(new Paragraph("Nenhum pagamento registrado.", bodyFont));
            } else {
                PdfPTable table = new PdfPTable(new float[]{3, 2, 2, 2});
                table.setWidthPercentage(100);
                addTableHeader(table, new String[]{"Referência", "Valor", "Pago em", "Status"});
                for (Payment p : payments) {
                    table.addCell(cell(p.getReferenceMonth(), bodyFont));
                    table.addCell(cell(p.getAmount() != null ? "R$ " + String.format("%.2f", p.getAmount()) : "-", bodyFont));
                    table.addCell(cell(p.getPaidDate() != null ? p.getPaidDate().toString() : "-", bodyFont));
                    PdfPCell statusCell = cell(p.getStatus(), bodyFont);
                    statusCell.setBackgroundColor("Pago".equals(p.getStatus()) ? Color.decode("#d4edda") : Color.decode("#fff3cd"));
                    table.addCell(statusCell);
                }
                doc.add(table);
            }

            doc.add(Chunk.NEWLINE);
            addSection(doc, "Histórico de Aulas", sectionFont);
            if (lessons.isEmpty()) {
                doc.add(new Paragraph("Nenhuma aula registrada.", bodyFont));
            } else {
                PdfPTable table = new PdfPTable(new float[]{3, 2, 4});
                table.setWidthPercentage(100);
                addTableHeader(table, new String[]{"Data", "Presença", "Observações"});
                for (Lesson l : lessons) {
                    table.addCell(cell(l.getLessonDate().toString(), bodyFont));
                    table.addCell(cell(Boolean.TRUE.equals(l.getAttended()) ? "Presente" : "Faltou", bodyFont));
                    table.addCell(cell(l.getNotes() != null ? l.getNotes() : "", bodyFont));
                }
                doc.add(table);
            }

            doc.close();
            return out.toByteArray();
        }
    }

    private void addSection(Document doc, String title, Font font) throws DocumentException {
        PdfPTable t = new PdfPTable(1);
        t.setWidthPercentage(100);
        PdfPCell c = new PdfPCell(new Phrase(title, font));
        c.setBackgroundColor(Color.decode("#2c3e50"));
        c.setPadding(6);
        c.setBorder(Rectangle.NO_BORDER);
        t.addCell(c);
        doc.add(t);
    }

    private void addField(Document doc, String label, String value, Font lf, Font bf) throws DocumentException {
        Paragraph p = new Paragraph();
        p.add(new Chunk(label + ": ", lf));
        p.add(new Chunk(value != null ? value : "-", bf));
        doc.add(p);
    }

    private void addTableHeader(PdfPTable table, String[] headers) {
        Font f = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
        for (String h : headers) {
            PdfPCell c = new PdfPCell(new Phrase(h, f));
            c.setBackgroundColor(Color.decode("#34495e"));
            c.setPadding(5);
            table.addCell(c);
        }
    }

    private PdfPCell cell(String val, Font font) {
        PdfPCell c = new PdfPCell(new Phrase(val, font));
        c.setPadding(4);
        return c;
    }
}
