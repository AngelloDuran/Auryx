package com.auryx.backend.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDTO {
    
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String name;
    
    private String description;
    
    @NotNull(message = "El precio es obligatorio")
    @Min(value = 0, message = "El precio debe ser mayor o igual a 0")
    private BigDecimal price;
    
    private String category;
    
    private String imageUrl;
    
    @Min(value = 0, message = "El stock debe ser mayor o igual a 0")
    private Integer stock = 0;
    
    private Boolean isActive = true;
}