package com.pgkart.controller;

import com.pgkart.payload.APIResponse;
import com.pgkart.payload.CouponDTO;
import com.pgkart.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // Admin endpoints
    @PostMapping("/admin/coupons")
    public ResponseEntity<CouponDTO> createCoupon(@RequestBody CouponDTO couponDTO) {
        CouponDTO created = couponService.createCoupon(couponDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/admin/coupons")
    public ResponseEntity<List<CouponDTO>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @DeleteMapping("/admin/coupons/{id}")
    public ResponseEntity<APIResponse> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(new APIResponse("Coupon deleted successfully", true));
    }

    // Public endpoints
    @GetMapping("/public/coupons/validate")
    public ResponseEntity<CouponDTO> validateCoupon(@RequestParam String code) {
        return ResponseEntity.ok(couponService.validateCoupon(code));
    }
}
