package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.AddCartItemRequest;
import com.ecommerce.backend.dto.CartDTO;
import com.ecommerce.backend.dto.CartItemDTO;
import com.ecommerce.backend.dto.UpdateCartItemRequest;
import com.ecommerce.backend.model.Cart;
import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    private final UserService userService;

    @Transactional(readOnly = true)
    public CartDTO getCart(Authentication auth) {
        User user = userService.getOrCreateUser(auth);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> Cart.builder().user(user).items(new ArrayList<>()).build());
        return toDto(cart);
    }

    @Transactional
    public CartDTO addItem(Authentication auth, AddCartItemRequest request) {
        User user = userService.getOrCreateUser(auth);
        Cart cart = getOrCreateCart(user);
        Product product = productService.getProductEntity(request.getProductId());

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElseGet(() -> CartItem.builder()
                        .cart(cart)
                        .product(product)
                        .quantity(0)
                        .build());

        int newQuantity = item.getQuantity() + request.getQuantity();
        validateQuantity(product, newQuantity);
        item.setQuantity(newQuantity);
        cartItemRepository.save(item);

        return toDto(getOrCreateCart(user));
    }

    @Transactional
    public CartDTO updateItem(Authentication auth, Long itemId, UpdateCartItemRequest request) {
        User user = userService.getOrCreateUser(auth);
        Cart cart = getOrCreateCart(user);
        CartItem item = findOwnedItem(cart, itemId);

        if (request.getQuantity() == 0) {
            cartItemRepository.delete(item);
            return toDto(getOrCreateCart(user));
        }

        validateQuantity(item.getProduct(), request.getQuantity());
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return toDto(getOrCreateCart(user));
    }

    @Transactional
    public CartDTO removeItem(Authentication auth, Long itemId) {
        User user = userService.getOrCreateUser(auth);
        Cart cart = getOrCreateCart(user);
        cartItemRepository.delete(findOwnedItem(cart, itemId));
        return toDto(getOrCreateCart(user));
    }

    @Transactional
    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Transactional
    public Cart getCartEntity(Authentication auth) {
        User user = userService.getOrCreateUser(auth);
        return getOrCreateCart(user);
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .user(user)
                        .items(new ArrayList<>())
                        .build()));
    }

    private CartItem findOwnedItem(Cart cart, Long itemId) {
        return cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
    }

    private void validateQuantity(Product product, int quantity) {
        if (quantity > product.getStockQuantity()) {
            throw new IllegalArgumentException("Only " + product.getStockQuantity() + " items available");
        }
    }

    public CartDTO toDto(Cart cart) {
        var items = cart.getItems().stream()
                .map(this::toItemDto)
                .toList();

        int totalItems = items.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();

        BigDecimal subtotal = items.stream()
                .map(CartItemDTO::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDTO.builder()
                .id(cart.getId())
                .items(items)
                .totalItems(totalItems)
                .subtotal(subtotal)
                .build();
    }

    private CartItemDTO toItemDto(CartItem item) {
        Product product = item.getProduct();
        String imageUrl = product.getImageUrls().isEmpty() ? null : product.getImageUrls().get(0);
        BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemDTO.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .imageUrl(imageUrl)
                .unitPrice(product.getPrice())
                .quantity(item.getQuantity())
                .availableStock(product.getStockQuantity())
                .lineTotal(lineTotal)
                .build();
    }
}
