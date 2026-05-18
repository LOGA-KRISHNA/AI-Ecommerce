package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CategoryDTO;
import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        if (categoryRepository.existsByNameIgnoreCase(categoryDTO.getName())) {
            throw new IllegalArgumentException("Category already exists");
        }

        Category category = Category.builder()
                .name(categoryDTO.getName())
                .description(categoryDTO.getDescription())
                .imageUrl(categoryDTO.getImageUrl())
                .build();

        return toDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDTO updateCategory(String id, CategoryDTO categoryDTO) {
        Category category = getCategory(id);
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setImageUrl(categoryDTO.getImageUrl());
        return toDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(String id) {
        long productCount = categoryRepository.countProductsByCategoryId(id);
        if (productCount > 0) {
            throw new IllegalStateException("Category has active products");
        }
        categoryRepository.delete(getCategory(id));
    }

    @Transactional(readOnly = true)
    public Category getCategory(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    public CategoryDTO toDto(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .productCount((int) categoryRepository.countProductsByCategoryId(category.getId()))
                .build();
    }
}
