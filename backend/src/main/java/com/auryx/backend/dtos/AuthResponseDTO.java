package com.auryx.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String type;
    private Long id;
    private String email;
    private String name;
    
    public AuthResponseDTO(String token, Long id, String email, String name) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.email = email;
        this.name = name;
    }
}