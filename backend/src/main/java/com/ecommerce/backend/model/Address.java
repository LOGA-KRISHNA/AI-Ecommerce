package com.ecommerce.backend.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="addresses")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id",nullable = false)
    private User user;

    private String name;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private boolean isDefault;
}
