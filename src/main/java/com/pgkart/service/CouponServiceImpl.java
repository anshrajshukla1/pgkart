package com.pgkart.service;

import com.pgkart.exceptions.ApiException;
import com.pgkart.exceptions.ResourceNotFoundException;
import com.pgkart.model.Coupon;
import com.pgkart.payload.CouponDTO;
import com.pgkart.repositories.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final ModelMapper modelMapper;

    @Override
    public CouponDTO createCoupon(CouponDTO couponDTO) {
        if (couponRepository.findByCode(couponDTO.getCode()).isPresent()) {
            throw new ApiException("Coupon code already exists");
        }
        Coupon coupon = modelMapper.map(couponDTO, Coupon.class);
        Coupon saved = couponRepository.save(coupon);
        return modelMapper.map(saved, CouponDTO.class);
    }

    @Override
    public List<CouponDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(c -> modelMapper.map(c, CouponDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCoupon(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", couponId.toString()));
        couponRepository.delete(coupon);
    }

    @Override
    public CouponDTO validateCoupon(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ApiException("Invalid coupon code"));
        
        if (!coupon.isActive()) {
            throw new ApiException("Coupon is inactive");
        }
        
        return modelMapper.map(coupon, CouponDTO.class);
    }
}
