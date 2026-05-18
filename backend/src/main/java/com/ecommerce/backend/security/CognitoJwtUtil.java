package com.ecommerce.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class CognitoJwtUtil {

    /** Extract the Cognito user sub (unique user ID) from the JWT. */
    public String extractUserId(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        return jwt.getSubject();               // "sub" claim
    }

    /** Extract the user's email from the JWT. */
    public String extractEmail(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        return jwt.getClaimAsString("email");
    }

    /** Extract the user's display name (Cognito "name" attribute). */
    public String extractName(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        String name = jwt.getClaimAsString("name");
        return name != null ? name : jwt.getClaimAsString("email");
    }
}