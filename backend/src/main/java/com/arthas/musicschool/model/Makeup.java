package com.arthas.musicschool.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "makeups")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Makeup {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private LocalDate scheduledDate;
    private String dayOfWeek;
    private String slotTime;
    private String notes;

    @Builder.Default
    private String status = "Pendente";
}
