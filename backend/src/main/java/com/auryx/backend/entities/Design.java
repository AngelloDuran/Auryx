package com.auryx.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "designs")
@Data
@NoArgsConstructor
public class Design {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String imageData;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false)
    private String status = "active";
    
    @Column(columnDefinition = "LONGTEXT")
    private String configuration;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}