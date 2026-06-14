package com.pgkart.service;

import com.pgkart.exceptions.ApiException;
import com.pgkart.exceptions.ResourceNotFoundException;
import com.pgkart.model.Category;
import com.pgkart.payload.CategoryDTO;
import com.pgkart.payload.CategoryResponse;
import com.pgkart.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByCategoryName(dto.getCategoryName())) {
            throw new ApiException("Category already exists: " + dto.getCategoryName());
        }
        Category saved = categoryRepository.save(modelMapper.map(dto, Category.class));
        return modelMapper.map(saved, CategoryDTO.class);
    }

    @Override
    public CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Category> page = categoryRepository.findAll(pageable);

        List<CategoryDTO> dtos = page.getContent().stream()
                .map(c -> modelMapper.map(c, CategoryDTO.class))
                .collect(Collectors.toList());

        CategoryResponse response = new CategoryResponse();
        response.setContent(dtos);
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLastPage(page.isLast());
        return response;
    }

    @Override
    public CategoryDTO updateCategory(Long categoryId, CategoryDTO dto) {
        Category cat = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId.toString()));
        cat.setCategoryName(dto.getCategoryName());
        return modelMapper.map(categoryRepository.save(cat), CategoryDTO.class);
    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId) {
        Category cat = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId.toString()));
        categoryRepository.delete(cat);
        return modelMapper.map(cat, CategoryDTO.class);
    }
}
