package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CategoryDTO;
import com.ecommerce.backend.dto.ProductDTO;
import com.ecommerce.backend.dto.ProductFilterRequest;
import com.ecommerce.backend.service.CategoryService;
import com.ecommerce.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("/api/public/products")
    public Page<ProductDTO> products(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        ProductFilterRequest filters = new ProductFilterRequest(
                categoryId,
                minPrice,
                maxPrice,
                inStock,
                q,
                sort
        );

        return productService.findProducts(filters, PageRequest.of(page, Math.min(size, 50), toSort(sort)));
    }

    @GetMapping("/api/public/products/{id}")
    public ProductDTO product(@PathVariable String id) {
        return productService.getProduct(id);
    }

    @GetMapping("/api/public/categories")
    public List<CategoryDTO> categories() {
        return categoryService.getAllCategories();
    }

    @PostMapping("/api/products")
    public ProductDTO createProduct(@Valid @RequestBody ProductDTO dto) {
        return productService.createProduct(dto);
    }

    @PutMapping("/api/products/{id}")
    public ProductDTO updateProduct(@PathVariable String id, @Valid @RequestBody ProductDTO dto) {
        return productService.updateProduct(id, dto);
    }

    @DeleteMapping("/api/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/categories")
    public CategoryDTO createCategory(@Valid @RequestBody CategoryDTO dto) {
        return categoryService.createCategory(dto);
    }

    @PutMapping("/api/categories/{id}")
    public CategoryDTO updateCategory(@PathVariable String id, @Valid @RequestBody CategoryDTO dto) {
        return categoryService.updateCategory(id, dto);
    }

    @DeleteMapping("/api/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    private Sort toSort(String sort) {
        return switch (sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "name" -> Sort.by("name").ascending();
            default -> Sort.by("createdAt").descending();
        };
    }
}
