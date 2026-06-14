package com.pgkart.payload;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayVerifyRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private Long pgkartOrderId;
    private Long addressId;
}
