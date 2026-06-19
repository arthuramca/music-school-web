package com.arthas.musicschool.dto;

import com.arthas.musicschool.model.Student;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentDTO {
    private Long id;
    private String name;
    private String cpf;
    private LocalDate birthDate;
    private String phone;
    private String email;
    private String address;
    private String instrument;
    private String instrument2;
    private String level;
    private String teacher;
    private LocalDate startDate;
    private Double monthlyFee;
    private Integer paymentDueDay;
    private String status;
    private String notes;
    private String lessonDay;
    private String lessonTime;
    private String lessonDay2;
    private String lessonTime2;
    private Integer makeupPending;

    public static StudentDTO from(Student s) {
        StudentDTO dto = new StudentDTO();
        dto.id            = s.getId();
        dto.name          = s.getName();
        dto.cpf           = s.getCpf();
        dto.birthDate     = s.getBirthDate();
        dto.phone         = s.getPhone();
        dto.email         = s.getEmail();
        dto.address       = s.getAddress();
        dto.instrument    = s.getInstrument();
        dto.instrument2   = s.getInstrument2();
        dto.level         = s.getLevel();
        dto.teacher       = s.getTeacher();
        dto.startDate     = s.getStartDate();
        dto.monthlyFee    = s.getMonthlyFee();
        dto.paymentDueDay = s.getPaymentDueDay();
        dto.status        = s.getStatus();
        dto.notes         = s.getNotes();
        dto.lessonDay     = s.getLessonDay();
        dto.lessonTime    = s.getLessonTime();
        dto.lessonDay2    = s.getLessonDay2();
        dto.lessonTime2   = s.getLessonTime2();
        dto.makeupPending = s.getMakeupPending();
        return dto;
    }
}
