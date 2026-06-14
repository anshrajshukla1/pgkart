package com.pgkart.service;

import com.pgkart.payload.AddressDTO;

import java.util.List;

public interface AddressService {

    AddressDTO createAddress(AddressDTO addressDTO);

    List<AddressDTO> getAddressesByUser();

    AddressDTO updateAddress(Long addressId, AddressDTO addressDTO);

    void deleteAddress(Long addressId);
}
