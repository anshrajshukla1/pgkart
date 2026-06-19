package com.pgkart.controller;

import com.pgkart.exceptions.ApiException;
import com.pgkart.model.Order;
import com.pgkart.payload.*;
import com.pgkart.repositories.OrderRepository;
import com.pgkart.service.EmailService;
import com.pgkart.service.OrderService;
import com.pgkart.service.RazorpayService;
import com.pgkart.util.AuthUtil;
import com.pgkart.config.AppConstants;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class OrderController {

    private final OrderService orderService;
    private final RazorpayService razorpayService;
    private final EmailService emailService;
    private final OrderRepository orderRepository;
    private final AuthUtil authUtil;

    // ===== RAZORPAY PAYMENT ENDPOINTS =====

    /**
     * Step 1: Create a Razorpay order (before payment)
     */
    @PostMapping("/payment/razorpay/create-order")
    public ResponseEntity<Map<String, Object>> createRazorpayOrder(
            @RequestBody RazorpayOrderRequest request) {
        try {
            JSONObject razorpayOrder = razorpayService.createOrder(request);
            Map<String, Object> response = new HashMap<>();
            response.put("razorpayOrderId", razorpayOrder.getString("id"));
            response.put("amount", razorpayOrder.getLong("amount"));
            response.put("currency", razorpayOrder.getString("currency"));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to create payment order", e);
            throw new ApiException("Failed to create payment order: " + e.getMessage());
        }
    }

    /**
     * Step 2: Verify Razorpay payment and place the order
     */
    @PostMapping("/payment/razorpay/verify")
    public ResponseEntity<OrderDTO> verifyAndPlaceOrder(
            @RequestBody RazorpayVerifyRequest verifyRequest) {
        boolean valid = razorpayService.verifyPaymentSignature(
                verifyRequest.getRazorpayOrderId(),
                verifyRequest.getRazorpayPaymentId(),
                verifyRequest.getRazorpaySignature()
        );
        if (!valid) {
            throw new ApiException("Payment verification failed. Invalid signature.");
        }

        String emailId = authUtil.loggedInEmail();
        OrderDTO order = orderService.placeOrder(
                emailId,
                verifyRequest.getAddressId(),
                "RAZORPAY",
                verifyRequest.getRazorpayOrderId(),
                verifyRequest.getRazorpayPaymentId(),
                verifyRequest.getRazorpaySignature(),
                "PAYMENT_SUCCESS",
                verifyRequest.getCouponCode(),
                verifyRequest.getDiscountAmount(),
                verifyRequest.getDeliveryFee()
        );

        // Send confirmation email asynchronously
        orderRepository.findByIdWithItems(order.getOrderId()).ifPresent(emailService::sendOrderConfirmation);

        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    /**
     * Place a Cash on Delivery (COD) order directly without Razorpay
     */
    @PostMapping("/payment/cod/place")
    public ResponseEntity<OrderDTO> placeCodOrder(@RequestBody CODOrderRequest request) {
        String emailId = authUtil.loggedInEmail();
        OrderDTO order = orderService.placeOrder(
                emailId,
                request.getAddressId(),
                "COD",
                "COD-" + System.currentTimeMillis(),
                null,
                null,
                "PENDING_COD",
                request.getCouponCode(),
                request.getDiscountAmount(),
                request.getDeliveryFee()
        );

        // Send confirmation email asynchronously
        orderRepository.findByIdWithItems(order.getOrderId()).ifPresent(emailService::sendOrderConfirmation);

        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    // ===== ORDER MANAGEMENT =====

    @GetMapping("/orders/user")
    public ResponseEntity<java.util.List<OrderDTO>> getUserOrders() {
        String email = authUtil.loggedInEmail();
        return ResponseEntity.ok(orderService.getOrdersByEmail(email));
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<OrderResponse> getAllOrders(
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER) Integer pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE) Integer pageSize,
            @RequestParam(defaultValue = AppConstants.SORT_ORDERS_BY) String sortBy,
            @RequestParam(defaultValue = AppConstants.SORT_DIR) String sortOrder) {
        return ResponseEntity.ok(orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder));
    }

    @PutMapping("/admin/orders/{orderId}/tracking")
    public ResponseEntity<OrderDTO> updateOrderTracking(
            @PathVariable Long orderId,
            @RequestBody OrderTrackingDTO trackingDTO) {
        OrderDTO updated = orderService.updateOrderTracking(orderId, trackingDTO);

        // Send email based on new status
        orderRepository.findByIdWithItems(orderId).ifPresent(order -> {
            String status = order.getOrderStatus();
            if ("SHIPPED".equalsIgnoreCase(status) && !Boolean.TRUE.equals(order.getShippedEmailSent())) {
                emailService.sendOrderShipped(order);
                order.setShippedEmailSent(true);
                orderRepository.save(order);
            } else if ("DELIVERED".equalsIgnoreCase(status) && !Boolean.TRUE.equals(order.getDeliveredEmailSent())) {
                emailService.sendOrderDelivered(order);
                order.setDeliveredEmailSent(true);
                orderRepository.save(order);
            }
        });

        return ResponseEntity.ok(updated);
    }

    // ===== RETURNS =====

    @PostMapping("/orders/{orderId}/return")
    public ResponseEntity<APIResponse> requestReturn(@PathVariable Long orderId) {
        String email = authUtil.loggedInEmail();
        orderService.requestReturn(orderId, email);
        return ResponseEntity.ok(new APIResponse("Return requested successfully", true));
    }

    @PutMapping("/admin/orders/{orderId}/return")
    public ResponseEntity<APIResponse> handleReturnRequest(
            @PathVariable Long orderId,
            @RequestParam boolean approve) {
        orderService.handleReturnRequest(orderId, approve);
        
        orderRepository.findByIdWithItems(orderId).ifPresent(order -> {
            if (approve) {
                emailService.sendReturnApproved(order);
            } else {
                emailService.sendReturnDeclined(order);
            }
        });

        return ResponseEntity.ok(new APIResponse(approve ? "Return approved" : "Return declined", true));
    }
}
