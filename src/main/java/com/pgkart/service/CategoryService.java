package com.pgkart.service;

import com.pgkart.payload.CategoryDTO;
import com.pgkart.payload.CategoryResponse;

public interface CategoryService {

    CategoryDTO createCategory(CategoryDTO categoryDTO);

    CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO);

    CategoryDTO deleteCategory(Long categoryId);
}
