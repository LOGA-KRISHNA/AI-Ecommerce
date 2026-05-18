package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CreateOrderRequest;
import com.ecommerce.backend.dto.OrderDTO;
import com.ecommerce.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public List<OrderDTO> orders(Authentication auth) {
        return orderService.getOrders(auth);
    }

    @GetMapping("/{orderId}")
    public OrderDTO order(Authentication auth, @PathVariable Long orderId) {
        return orderService.getOrder(auth, orderId);
    }

    @PostMapping
    public OrderDTO createOrder(Authentication auth, @Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(auth, request);
    }
}
