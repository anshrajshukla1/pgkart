package com.pgkart.repositories;

import com.pgkart.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByProductNameContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.lowStockThreshold")
    List<Product> findLowStockProducts();

    Page<Product> findByIsFeaturedTrue(Pageable pageable);

}
