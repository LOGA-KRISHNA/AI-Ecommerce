package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.AddCartItemRequest;
import com.ecommerce.backend.dto.CartDTO;
import com.ecommerce.backend.dto.UpdateCartItemRequest;
import com.ecommerce.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public CartDTO getCart(Authentication auth) {
        return cartService.getCart(auth);
    }

    @PostMapping("/items")
    public CartDTO addItem(Authentication auth, @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(auth, request);
    }

    @PutMapping("/items/{itemId}")
    public CartDTO updateItem(
            Authentication auth,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return cartService.updateItem(auth, itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeItem(Authentication auth, @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(auth, itemId));
    }
}
