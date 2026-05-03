package com.auryx.backend.services;

import com.auryx.backend.dtos.AuthResponseDTO;
import com.auryx.backend.dtos.LoginRequestDTO;
import com.auryx.backend.dtos.UserDTO;
import com.auryx.backend.dtos.UserResponseDTO;
import com.auryx.backend.entities.User;
import com.auryx.backend.repositories.UserRepository;
import com.auryx.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Transactional
    public UserResponseDTO createUser(UserDTO userDTO) {
        // Verificar si el email ya existe
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Crear nuevo usuario
        User user = new User();
        user.setEmail(userDTO.getEmail());
        // Encriptar la contraseña antes de guardar
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        user.setName(userDTO.getName());
        user.setGoogleId(userDTO.getGoogleId());
        
        User savedUser = userRepository.save(user);
        
        return convertToResponseDTO(savedUser);
    }
    
    @Transactional(readOnly = true)
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToResponseDTO(user);
    }
    
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToResponseDTO(user);
    }
    
    @Transactional(readOnly = true)
    public AuthResponseDTO authenticate(LoginRequestDTO loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException("Usuario registrado con Google. Por favor usa Google Login");
        }
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        // Generar token JWT
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        
        return new AuthResponseDTO(token, user.getId(), user.getEmail(), user.getName());
    }
    
    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setGoogleId(user.getGoogleId());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}