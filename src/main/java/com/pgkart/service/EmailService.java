package com.pgkart.service;

import com.pgkart.model.Order;

public interface EmailService {
    void sendOrderConfirmation(Order order);
    void sendOrderShipped(Order order);
    void sendOrderDelivered(Order order);
    void sendReturnApproved(Order order);
    void sendReturnDeclined(Order order);
    void sendPasswordResetEmail(String toEmail, String resetLink);
}
