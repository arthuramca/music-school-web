package com.arthas.musicschool.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
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

    @Builder.Default
    private String status = "Ativo";

    private String notes;
    private String photoPath;
    private String lessonDay;
    private String lessonTime;
    private String lessonDay2;
    private String lessonTime2;

    @Builder.Default
    private Integer makeupPending = 0;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lesson> lessons;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Makeup> makeups;
}
