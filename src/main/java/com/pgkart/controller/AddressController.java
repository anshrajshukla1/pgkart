package com.pgkart.controller;

import com.pgkart.payload.AddressDTO;
import com.pgkart.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses() {
        return ResponseEntity.ok(addressService.getAddressesByUser());
    }

    @PostMapping
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.createAddress(addressDTO));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressDTO> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressDTO addressDTO) {
        return ResponseEntity.ok(addressService.updateAddress(addressId, addressDTO));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.noContent().build();
    }
}
