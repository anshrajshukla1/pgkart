package com.pgkart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Email
    @Column(nullable = false)
    private String email;

    @OneToMany(mappedBy = "order", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<OrderItem> orderItems = new ArrayList<>();

    private LocalDate orderDate;

    @OneToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;

    private BigDecimal totalAmount;

    private String orderStatus;

    // Can be: null, REQUESTED, APPROVED, DECLINED, RETURNED
    private String returnStatus;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    // Order tracking fields
    private String trackingId;

    private String courierName;

    private String trackingUrl;

    // Email notification tracking
    private Boolean confirmationEmailSent = false;

    private Boolean shippedEmailSent = false;

    private Boolean deliveredEmailSent = false;

    // Coupon tracking
    private String appliedCouponCode;
    private BigDecimal discountAmount;

    private BigDecimal deliveryFee = BigDecimal.ZERO;
}
