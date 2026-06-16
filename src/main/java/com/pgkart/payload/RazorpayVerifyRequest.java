package com.pgkart.payload;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayVerifyRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private Long pgkartOrderId;
    private Long addressId;
    private String couponCode;
    private BigDecimal discountAmount;
}
