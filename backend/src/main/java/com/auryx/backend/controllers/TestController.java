package com.auryx.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/api/test")
    public String test() {
        return "¡VS Code + Spring Boot funcionando! 🚀";
    }
}