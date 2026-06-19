package com.pgkart.payload;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CODOrderRequest {
    private Long addressId;
    private String couponCode;
    private BigDecimal discountAmount;
    private BigDecimal deliveryFee;
}
