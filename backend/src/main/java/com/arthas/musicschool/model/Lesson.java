package com.arthas.musicschool.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "lessons")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Lesson {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private LocalDate lessonDate;

    @Builder.Default
    private Boolean attended = true;

    private String notes;
}
