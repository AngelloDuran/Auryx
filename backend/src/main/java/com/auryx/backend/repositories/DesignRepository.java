package com.auryx.backend.repositories;

import com.auryx.backend.entities.Design;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DesignRepository extends JpaRepository<Design, Long> {
    
    List<Design> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Design> findByUserIdAndType(Long userId, String type);
    
    List<Design> findByUserIdAndStatus(Long userId, String status);
}