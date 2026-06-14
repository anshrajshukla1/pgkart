package com.pgkart.payload;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderTrackingDTO {
    private String orderStatus;
    private String trackingId;
    private String courierName;
    private String trackingUrl;
}
