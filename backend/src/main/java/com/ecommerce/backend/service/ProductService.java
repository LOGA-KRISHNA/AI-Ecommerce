package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDTO;
import com.ecommerce.backend.dto.ProductFilterRequest;
import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    @Transactional(readOnly = true)
    public Page<ProductDTO> findProducts(ProductFilterRequest filters, Pageable pageable) {
        return productRepository.findAll(withFilters(filters), pageable)
                .map(this::toDto);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProduct(String id) {
        return toDto(getProductEntity(id));
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO dto) {
        Product product = new Product();
        applyDto(product, dto);
        product.setActive(true);
        product.setReviewsCount(0);
        return toDto(productRepository.save(product));
    }

    @Transactional
    public ProductDTO updateProduct(String id, ProductDTO dto) {
        Product product = getProductEntity(id);
        applyDto(product, dto);
        product.setActive(dto.isActive());
        return toDto(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(String id) {
        Product product = getProductEntity(id);
        product.setActive(false);
        productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public Product getProductEntity(String id) {
        return productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    private void applyDto(Product product, ProductDTO dto) {
        Category category = categoryService.getCategory(dto.getCategoryId());

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(category);
        product.setImageUrls(dto.getImageUrls() == null ? new ArrayList<>() : new ArrayList<>(dto.getImageUrls()));
        product.setTags(dto.getTags() == null ? new ArrayList<>() : new ArrayList<>(dto.getTags()));
    }

    private Specification<Product> withFilters(ProductFilterRequest filters) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (filters == null) {
                return cb.and(predicates.toArray(Predicate[]::new));
            }

            if (filters.getCategoryId() != null && !filters.getCategoryId().isBlank()) {
                predicates.add(cb.equal(root.get("category").get("id"), filters.getCategoryId()));
            }
            if (filters.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filters.getMinPrice()));
            }
            if (filters.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filters.getMaxPrice()));
            }
            if (Boolean.TRUE.equals(filters.getInStock())) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }
            if (filters.getSearch() != null && !filters.getSearch().isBlank()) {
                String pattern = "%" + filters.getSearch().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    public ProductDTO toDto(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .reviewsCount(product.getReviewsCount())
                .imageUrls(new ArrayList<>(product.getImageUrls()))
                .tags(new ArrayList<>(product.getTags()))
                .active(product.isActive())
                .createdAt(product.getCreatedAt())
                .category(categoryService.toDto(product.getCategory()))
                .categoryId(product.getCategory().getId())
                .build();
    }
}
