package com.auryx.backend.services;

import com.auryx.backend.dtos.ProductDTO;
import com.auryx.backend.dtos.ProductResponseDTO;
import com.auryx.backend.entities.Product;
import com.auryx.backend.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    @Transactional
    public ProductResponseDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return convertToResponseDTO(savedProduct);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
            .stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getActiveProducts() {
        return productRepository.findByIsActiveTrue()
            .stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return convertToResponseDTO(product);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category)
            .stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name)
            .stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public ProductResponseDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        // Actualizar campos
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setCategory(productDTO.getCategory());
        product.setImageUrl(productDTO.getImageUrl());
        product.setStock(productDTO.getStock());
        product.setIsActive(productDTO.getIsActive());
        
        Product updatedProduct = productRepository.save(product);
        return convertToResponseDTO(updatedProduct);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        productRepository.delete(product);
    }
    
    @Transactional
    public ProductResponseDTO updateStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        int newStock = product.getStock() + quantity;
        if (newStock < 0) {
            throw new RuntimeException("Stock insuficiente. Stock actual: " + product.getStock());
        }
        
        product.setStock(newStock);
        Product updatedProduct = productRepository.save(product);
        return convertToResponseDTO(updatedProduct);
    }
    
    // Métodos privados de conversión
    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());
        product.setStock(dto.getStock() != null ? dto.getStock() : 0);
        product.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return product;
    }
    
    private ProductResponseDTO convertToResponseDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setImageUrl(product.getImageUrl());
        dto.setStock(product.getStock());
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
}