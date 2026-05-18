package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.AddressDTO;
import com.ecommerce.backend.model.Address;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.AddressRepository;
import com.ecommerce.backend.security.CognitoJwtUtil;
import com.ecommerce.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressRepository addressRepo;
    private final UserService userService;
    private final CognitoJwtUtil jwtUtil;

    @GetMapping
    public List<AddressDTO> list(Authentication auth) {
        String userId = jwtUtil.extractUserId(auth);
        return addressRepo.findByUserId(userId).stream().map(this::toDTO).toList();
    }

    @PostMapping
    public AddressDTO create(Authentication auth,
                             @Valid @RequestBody AddressDTO dto) {
        User user = userService.getOrCreateUser(auth);
        Address address = Address.builder()
            .user(user).name(dto.getName())
            .city(dto.getCity()).state(dto.getState()).pincode(dto.getPincode())
            .isDefault(dto.isDefault())
            .build();
        return toDTO(addressRepo.save(address));
    }
    @PutMapping("/{id}")
    public AddressDTO update(Authentication auth,@PathVariable Long id, @Valid @RequestBody AddressDTO dto) {
        Address address = addressRepo.findById(id).orElseThrow(() ->
                        new RuntimeException("Address not found")
                );

        String cognitoUserId = jwtUtil.extractUserId(auth);

        if (!address.getUser().getId().equals(cognitoUserId)) {

            throw new SecurityException("Not your address");
        }

        address.setName(dto.getName());

        address.setCity(dto.getCity());

        address.setState(dto.getState());

        address.setPincode(dto.getPincode());

        address.setDefault(dto.isDefault());

        return toDTO(
                addressRepo.save(address)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable String id) {
        Address address = addressRepo.findById(Long.valueOf(id))
            .orElseThrow(() -> new RuntimeException("Address not found"));
        if (!address.getUser().getId().equals(jwtUtil.extractUserId(auth)))
            throw new SecurityException("Not your address");
        addressRepo.delete(address);
        return ResponseEntity.noContent().build();
    }

    private AddressDTO toDTO(Address a) {
        return AddressDTO.builder()
            .id(String.valueOf(a.getId())).name(a.getName())
            .city(a.getCity()).state(a.getState()).pincode(a.getPincode())
            .isDefault(a.isDefault())
            .build();
    }
}
