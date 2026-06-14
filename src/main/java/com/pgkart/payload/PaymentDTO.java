package com.pgkart.payload;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private Long paymentId;
    private String paymentMethod;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String pgStatus;
}
