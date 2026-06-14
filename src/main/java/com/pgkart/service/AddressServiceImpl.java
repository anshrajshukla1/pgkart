package com.pgkart.service;

import com.pgkart.exceptions.ResourceNotFoundException;
import com.pgkart.model.Address;
import com.pgkart.model.User;
import com.pgkart.payload.AddressDTO;
import com.pgkart.repositories.AddressRepository;
import com.pgkart.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final ModelMapper modelMapper;
    private final AuthUtil authUtil;

    @Override
    @Transactional
    public AddressDTO createAddress(AddressDTO dto) {
        User user = authUtil.loggedInUser();
        Address address = modelMapper.map(dto, Address.class);
        address.setUser(user);
        return modelMapper.map(addressRepository.save(address), AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddressesByUser() {
        Long userId = authUtil.loggedInUserId();
        return addressRepository.findByUserUserId(userId).stream()
                .map(a -> modelMapper.map(a, AddressDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(Long addressId, AddressDTO dto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId.toString()));

        if (dto.getStreet() != null) address.setStreet(dto.getStreet());
        if (dto.getCity() != null) address.setCity(dto.getCity());
        if (dto.getState() != null) address.setState(dto.getState());
        if (dto.getPincode() != null) address.setPincode(dto.getPincode());

        return modelMapper.map(addressRepository.save(address), AddressDTO.class);
    }

    @Override
    @Transactional
    public void deleteAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId.toString()));
        addressRepository.delete(address);
    }
}
