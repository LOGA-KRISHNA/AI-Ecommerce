// AddressDTO.java
package com.ecommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AddressDTO {
    private String id;
    @NotBlank private String name;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank private String pincode;
    private boolean isDefault;
}