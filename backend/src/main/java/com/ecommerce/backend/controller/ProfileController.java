package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.MessageDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {

    @GetMapping("/api/profile")
    public ResponseEntity<MessageDto> privateMesaage(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(new MessageDto("Hello "+jwt.getClaims()));
    }
}
