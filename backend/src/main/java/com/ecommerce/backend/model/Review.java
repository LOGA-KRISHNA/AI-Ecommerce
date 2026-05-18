//package com.ecommerce.backend.model;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "reviews")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class Review {
//
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(updatable = false, nullable = false)
//    private String id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "product_id",nullable = false)
//    private Product product;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
//
//    @Column(nullable = false)
//    private Integer rating;
//
//    @Column
//    private String title;
//
//    @Column
//    private String body;
//}
