package com.auryx.backend.dtos;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class UserDTO {
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;
    
    private String password;  // Opcional para registro con email
    
    private String name;
    
    private String googleId;  // Para autenticación con Google
}