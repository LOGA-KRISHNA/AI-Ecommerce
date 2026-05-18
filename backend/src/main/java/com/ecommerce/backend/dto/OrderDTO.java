package com.ecommerce.backend.dto;

import com.ecommerce.backend.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String shippingName;
    private String shippingCity;
    private String shippingState;
    private String shippingPincode;
    private Instant createdAt;

    @Builder.Default
    private List<OrderItemDTO> items = new ArrayList<>();
}
