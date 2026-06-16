package com.pgkart.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long couponId;

    @Column(unique = true, nullable = false)
    private String code;

    // e.g. "FLAT" or "PERCENT"
    private String discountType;

    private BigDecimal discountValue;

    @Column(nullable = false)
    private BigDecimal minOrderValue = BigDecimal.ZERO;

    private boolean isActive = true;
}
