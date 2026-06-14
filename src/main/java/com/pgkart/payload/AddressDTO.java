package com.pgkart.payload;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private Long addressId;

    @NotBlank
    @Size(min = 5)
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    @Pattern(regexp = "\\d{6}")
    private String pincode;

    @NotBlank
    private String country;

    private String mobileNumber;
}
