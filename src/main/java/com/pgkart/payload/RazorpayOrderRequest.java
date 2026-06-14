package com.pgkart.payload;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderRequest {
    private Long amount; // in paise
    private String currency;
    private Long pgkartOrderId;
}
