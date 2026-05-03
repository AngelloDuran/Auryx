package com.auryx.backend.controllers;

import com.auryx.backend.entities.Design;
import com.auryx.backend.entities.User;
import com.auryx.backend.repositories.DesignRepository;
import com.auryx.backend.repositories.UserRepository;
import com.auryx.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/designs")
@RequiredArgsConstructor
public class DesignController {
    
    private final DesignRepository designRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    
    private User getAuthenticatedUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    @PostMapping
    public ResponseEntity<Design> saveDesign(@RequestBody Map<String, Object> designData, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        
        Design design = new Design();
        design.setUser(user);
        design.setName((String) designData.get("name"));
        design.setImageData((String) designData.get("imageData"));
        design.setType((String) designData.get("type"));
        if (designData.get("configuration") != null) {
            design.setConfiguration(designData.get("configuration").toString());
        }
        
        Design savedDesign = designRepository.save(design);
        return ResponseEntity.ok(savedDesign);
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<Design>> getUserDesigns(HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        List<Design> designs = designRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(designs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Design> getDesignById(@PathVariable Long id, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        Design design = designRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Diseño no encontrado"));
        
        if (!design.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No autorizado");
        }
        
        return ResponseEntity.ok(design);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDesign(@PathVariable Long id, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        Design design = designRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Diseño no encontrado"));
        
        if (!design.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No autorizado");
        }
        
        designRepository.delete(design);
        return ResponseEntity.ok(Map.of("message", "Diseño eliminado exitosamente"));
    }
}