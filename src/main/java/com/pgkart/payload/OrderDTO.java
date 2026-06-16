package com.pgkart.payload;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long orderId;
    private String email;
    private List<OrderItemDTO> orderItems = new ArrayList<>();
    private LocalDate orderDate;
    private PaymentDTO payment;
    private BigDecimal totalAmount;
    private String orderStatus;
    private AddressDTO address;
    private String trackingId;
    private String courierName;
    private String trackingUrl;
    private String returnStatus;
    private String appliedCouponCode;
    private BigDecimal discountAmount;
}
