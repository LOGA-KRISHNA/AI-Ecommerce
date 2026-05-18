package com.ecommerce.backend.configs;

import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CatalogSeeder implements CommandLineRunner {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0 || productRepository.count() > 0) {
            return;
        }

        Category laptops = categoryRepository.save(Category.builder()
                .name("Laptops")
                .description("Portable machines for work, study, and AI experiments.")
                .imageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80")
                .build());
        Category audio = categoryRepository.save(Category.builder()
                .name("Audio")
                .description("Headphones and speakers for focused listening.")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80")
                .build());
        Category wearables = categoryRepository.save(Category.builder()
                .name("Wearables")
                .description("Connected devices for health and everyday convenience.")
                .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80")
                .build());

        productRepository.saveAll(List.of(
                Product.builder()
                        .name("NovaBook Pro 14")
                        .description("A compact performance laptop with a vivid display, all-day battery, and AI-ready workflows.")
                        .price(new BigDecimal("1299.00"))
                        .stockQuantity(18)
                        .category(laptops)
                        .imageUrls(List.of("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"))
                        .tags(List.of("laptop", "productivity", "ai"))
                        .active(true)
                        .reviewsCount(24)
                        .build(),
                Product.builder()
                        .name("FocusPods Max")
                        .description("Noise-cancelling wireless headphones with balanced sound and soft memory-foam cups.")
                        .price(new BigDecimal("249.00"))
                        .stockQuantity(36)
                        .category(audio)
                        .imageUrls(List.of("https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80"))
                        .tags(List.of("audio", "wireless", "travel"))
                        .active(true)
                        .reviewsCount(41)
                        .build(),
                Product.builder()
                        .name("PulseFit Watch")
                        .description("A slim smartwatch with health tracking, notifications, and multi-day battery life.")
                        .price(new BigDecimal("179.00"))
                        .stockQuantity(27)
                        .category(wearables)
                        .imageUrls(List.of("https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80"))
                        .tags(List.of("watch", "fitness", "health"))
                        .active(true)
                        .reviewsCount(19)
                        .build(),
                Product.builder()
                        .name("StudioBeam Speaker")
                        .description("A desk-friendly Bluetooth speaker with clear vocals, warm bass, and USB-C charging.")
                        .price(new BigDecimal("89.00"))
                        .stockQuantity(44)
                        .category(audio)
                        .imageUrls(List.of("https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80"))
                        .tags(List.of("speaker", "bluetooth", "desk"))
                        .active(true)
                        .reviewsCount(13)
                        .build()
        ));
    }
}
