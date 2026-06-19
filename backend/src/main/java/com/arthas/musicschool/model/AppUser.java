package com.arthas.musicschool.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AppUser {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Builder.Default
    private String role = "ADMIN";
}
