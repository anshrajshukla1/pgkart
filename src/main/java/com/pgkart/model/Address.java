package com.pgkart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
