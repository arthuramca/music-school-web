package com.arthas.musicschool.controller;

import com.arthas.musicschool.dto.AuthRequest;
import com.arthas.musicschool.dto.AuthResponse;
import com.arthas.musicschool.model.AppUser;
import com.arthas.musicschool.repository.AppUserRepository;
import com.arthas.musicschool.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final AppUserRepository userRepo;
    private final PasswordEncoder encoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        AppUser user = userRepo.findByUsername(req.getUsername()).orElseThrow();
        String token = jwtUtil.generate(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole()));
    }

    @PostMapping("/setup")
    public ResponseEntity<String> setup(@RequestBody AuthRequest req) {
        if (userRepo.count() > 0) return ResponseEntity.badRequest().body("Já configurado.");
        userRepo.save(AppUser.builder()
                .username(req.getUsername())
                .password(encoder.encode(req.getPassword()))
                .role("ADMIN")
                .build());
        return ResponseEntity.ok("Usuário criado.");
    }
}
