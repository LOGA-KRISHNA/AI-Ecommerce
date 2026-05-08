package com.ecommerce.backend.controller;


import com.ecommerce.backend.dto.MessageDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class HealthController {

    @GetMapping("/api/public")
    public ResponseEntity<MessageDto> health() {
        return new ResponseEntity<>(new MessageDto("health"), HttpStatus.OK);
    }
}
