package com.pgkart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne(mappedBy = "payment", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Order order;

    @NotBlank
    @Size(min = 3)
    private String paymentMethod;

    // Razorpay fields
    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private String pgStatus;

    private String pgResponseMessage;

    public Payment(String paymentMethod, String razorpayOrderId, String razorpayPaymentId,
                   String razorpaySignature, String pgStatus) {
        this.paymentMethod = paymentMethod;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
        this.pgStatus = pgStatus;
    }
}
