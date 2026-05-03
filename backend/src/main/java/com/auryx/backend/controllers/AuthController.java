package com.auryx.backend.controllers;

import com.auryx.backend.dtos.AuthResponseDTO;
import com.auryx.backend.dtos.LoginRequestDTO;
import com.auryx.backend.dtos.UserDTO;
import com.auryx.backend.dtos.UserResponseDTO;
import com.auryx.backend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserDTO userDTO) {
        UserResponseDTO createdUser = userService.createUser(userDTO);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        AuthResponseDTO authResponse = userService.authenticate(loginRequest);
        return ResponseEntity.ok(authResponse);
    }
}