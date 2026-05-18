package com.ecommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateOrderRequest {
    private String addressId;

    @NotBlank
    private String shippingName;

    @NotBlank
    private String shippingCity;

    @NotBlank
    private String shippingState;

    @NotBlank
    private String shippingPincode;
}
