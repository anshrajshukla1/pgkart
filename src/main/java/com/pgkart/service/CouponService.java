package com.pgkart.service;

import com.pgkart.payload.CouponDTO;

import java.util.List;

public interface CouponService {
    CouponDTO createCoupon(CouponDTO couponDTO);
    List<CouponDTO> getAllCoupons();
    void deleteCoupon(Long couponId);
    CouponDTO validateCoupon(String code);
}
