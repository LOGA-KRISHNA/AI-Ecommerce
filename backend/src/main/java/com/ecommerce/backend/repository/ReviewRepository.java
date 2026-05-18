//package com.ecommerce.backend.repository;
//
//import com.ecommerce.backend.model.Review;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.Optional;
//
//public interface ReviewRepository extends JpaRepository<Review, String> {
//    Page<Review> findByProductId(String productId, Pageable pageable);
//    Optional<Review> findByProductIdAndUserId(String productId, String userId);
//
//    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId ")
//    long countByProductId(@Param("productId") String productId);
//}
