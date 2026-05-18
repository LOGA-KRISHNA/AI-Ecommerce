package com.ecommerce.backend.service;


import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public User getOrCreateUser(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        String cognitoSub = jwt.getClaimAsString("sub");

        return userRepository.findByEmail(email)
                .orElseGet(() -> {

                    User user = new User();

                    user.setEmail(email);
                    user.setName(name);
                    user.setId(cognitoSub);

                    return userRepository.save(user);
                });
    }
    @Transactional
    public User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }
}
