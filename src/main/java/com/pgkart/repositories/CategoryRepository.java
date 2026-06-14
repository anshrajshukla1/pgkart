package com.pgkart.repositories;

import com.pgkart.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryName(String categoryName);
    Boolean existsByCategoryName(String categoryName);
}
