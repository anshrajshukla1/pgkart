package com.pgkart.controller;

import com.pgkart.config.AppConstants;
import com.pgkart.payload.APIResponse;
import com.pgkart.payload.CategoryDTO;
import com.pgkart.payload.CategoryResponse;
import com.pgkart.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/public/categories")
    public ResponseEntity<CategoryResponse> getCategories(
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER) Integer pageNumber,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestParam(defaultValue = "categoryId") String sortBy,
            @RequestParam(defaultValue = AppConstants.SORT_DIR) String sortOrder) {
        return ResponseEntity.ok(categoryService.getAllCategories(pageNumber, pageSize, sortBy, sortOrder));
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(dto));
    }

    @PutMapping("/admin/categories/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, dto));
    }

    @DeleteMapping("/admin/categories/{categoryId}")
    public ResponseEntity<APIResponse> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(new APIResponse("Category deleted", true));
    }
}
