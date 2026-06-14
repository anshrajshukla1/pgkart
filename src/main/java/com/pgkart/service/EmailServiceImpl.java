package com.pgkart.service;

import com.pgkart.model.Order;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Value("${pgkart.mail.from}")
    private String fromEmail;

    @Value("${pgkart.mail.from.name}")
    private String fromName;

    // ------------------------------------------------------------------ //
    //  Public API — each method is async so the caller is never blocked   //
    // ------------------------------------------------------------------ //

    @Override
    @Async
    public void sendOrderConfirmation(Order order) {
        try {
            Context context = new Context();
            context.setVariable("orderId",       order.getOrderId());
            context.setVariable("customerEmail", order.getEmail());
            context.setVariable("orderDate",
                    order.getOrderDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
            context.setVariable("orderItems",    order.getOrderItems());
            context.setVariable("totalAmount",   order.getTotalAmount());
            context.setVariable("address",       order.getAddress());

            String html = templateEngine.process("email/order-confirmation", context);
            sendHtmlEmail(
                    order.getEmail(),
                    "Order Confirmed \u2014 PGKart #" + order.getOrderId(),
                    html
            );
            log.info("Order confirmation email sent for order {}", order.getOrderId());
        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order {}: {}", order.getOrderId(), e.getMessage());
        }
    }

    @Override
    @Async
    public void sendOrderShipped(Order order) {
        try {
            Context context = new Context();
            context.setVariable("orderId",     order.getOrderId());
            context.setVariable("courierName", order.getCourierName());
            context.setVariable("trackingId",  order.getTrackingId());
            context.setVariable("trackingUrl", order.getTrackingUrl());

            String html = templateEngine.process("email/order-shipped", context);
            sendHtmlEmail(
                    order.getEmail(),
                    "Your Order Has Shipped \u2014 PGKart #" + order.getOrderId(),
                    html
            );
            log.info("Order shipped email sent for order {}", order.getOrderId());
        } catch (Exception e) {
            log.error("Failed to send shipped email for order {}: {}", order.getOrderId(), e.getMessage());
        }
    }

    @Override
    @Async
    public void sendOrderDelivered(Order order) {
        try {
            Context context = new Context();
            context.setVariable("orderId", order.getOrderId());

            String html = templateEngine.process("email/order-delivered", context);
            sendHtmlEmail(
                    order.getEmail(),
                    "Your Order Has Been Delivered \u2014 PGKart #" + order.getOrderId(),
                    html
            );
            log.info("Order delivered email sent for order {}", order.getOrderId());
        } catch (Exception e) {
            log.error("Failed to send delivered email for order {}: {}", order.getOrderId(), e.getMessage());
        }
    }

    // ------------------------------------------------------------------ //
    //  Internal HTML Sender logic                                           //
    // ------------------------------------------------------------------ //

    private void sendHtmlEmail(String to, String subject, String htmlBody) throws Exception {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, fromName);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true indicates HTML content

        javaMailSender.send(message);
    }

    @Override
    @Async
    public void sendReturnApproved(Order order) {
        try {
            Context context = new Context();
            context.setVariable("orderId", order.getOrderId());
            String htmlBody = templateEngine.process("email/return-approved", context);
            sendHtmlEmail(order.getEmail(), "Return Approved - PGKart Order #" + order.getOrderId(), htmlBody);
            log.info("Return Approved email sent successfully for order {}", order.getOrderId());
        } catch (Exception e) {
            log.error("Failed to send return approved email for order {}", order.getOrderId(), e);
        }
    }

    @Override
    @Async
    public void sendReturnDeclined(Order order) {
        try {
            Context context = new Context();
            context.setVariable("orderId", order.getOrderId());
            String htmlBody = templateEngine.process("email/return-declined", context);
            sendHtmlEmail(order.getEmail(), "Return Request Declined - PGKart Order #" + order.getOrderId(), htmlBody);
            log.info("Return Declined email sent successfully for order {}", order.getOrderId());
        } catch (Exception e) {
            log.error("Failed to send return declined email for order {}", order.getOrderId(), e);
        }
    }
}
