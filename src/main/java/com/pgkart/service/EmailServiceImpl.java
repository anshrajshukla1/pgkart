package com.pgkart.service;

import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.UserCredentials;
import com.pgkart.model.Order;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Properties;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final TemplateEngine templateEngine;

    @Value("${gmail.client.id}")
    private String clientId;

    @Value("${gmail.client.secret}")
    private String clientSecret;

    @Value("${gmail.refresh.token}")
    private String refreshToken;

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

    @Override
    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        try {
            Context context = new Context();
            context.setVariable("resetLink", resetLink);

            String html = templateEngine.process("email/password-reset", context);
            sendHtmlEmail(toEmail, "Reset Your Password \u2014 PGKart", html);
            log.info("Password reset email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }

    // ------------------------------------------------------------------ //
    //  Internal HTML Sender logic (Gmail API)                              //
    // ------------------------------------------------------------------ //

    private void sendHtmlEmail(String to, String subject, String htmlBody) throws Exception {
        // 1. Build Credentials
        UserCredentials credentials = UserCredentials.newBuilder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRefreshToken(refreshToken)
                .build();

        // 2. Build Gmail Service
        Gmail service = new Gmail.Builder(
                new com.google.api.client.http.javanet.NetHttpTransport(),
                com.google.api.client.json.gson.GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
                .setApplicationName("PGKart")
                .build();

        // 3. Create a MimeMessage
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
        MimeMessage email = new MimeMessage(session);

        email.setFrom(new InternetAddress(fromEmail, fromName));
        email.addRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(to));
        email.setSubject(subject);
        email.setContent(htmlBody, "text/html; charset=utf-8");

        // 4. Encode and wrap for Gmail API
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        email.writeTo(buffer);
        byte[] rawMessageBytes = buffer.toByteArray();
        String encodedEmail = Base64.getUrlEncoder().encodeToString(rawMessageBytes);

        Message message = new Message();
        message.setRaw(encodedEmail);

        // 5. Send via Google API (over port 443, bypassing Render SMTP block)
        service.users().messages().send("me", message).execute();
    }
}
