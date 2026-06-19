package com.pgkart.service;

import com.pgkart.payload.OrderDTO;
import com.pgkart.payload.OrderResponse;
import com.pgkart.payload.OrderTrackingDTO;

import java.math.BigDecimal;
import java.util.List;

public interface OrderService {
    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod,
                        String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage,
                        String couponCode, BigDecimal discountAmount, BigDecimal deliveryFee);
    OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    OrderDTO updateOrderTracking(Long orderId, OrderTrackingDTO trackingDTO);
    List<OrderDTO> getOrdersByEmail(String email);
    void requestReturn(Long orderId, String email);
    void handleReturnRequest(Long orderId, boolean approve);
    void cancelOrder(Long orderId, String email);
}
