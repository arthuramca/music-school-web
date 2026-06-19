package com.arthas.musicschool.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "waitlist")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WaitlistEntry {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String phone;
    private String email;
    private String instrument;
    private String preferredDay;
    private String preferredTime;
    private LocalDate requestDate;
    private String notes;

    @Builder.Default
    private String status = "Aguardando";
}
