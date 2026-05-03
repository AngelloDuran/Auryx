package com.auryx.backend.dtos;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String email;
    private String name;
    private String googleId;
    private LocalDateTime createdAt;
}