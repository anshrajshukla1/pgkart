package com.pgkart.service;

import com.pgkart.payload.RazorpayOrderRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

/**
 * Razorpay payment gateway integration.
 *
 * <p>A fresh {@link RazorpayClient} is created per {@link #createOrder} call so that
 * the credentials are always read from the (potentially refreshed) Spring environment,
 * and there are no thread-safety concerns with a shared client instance.</p>
 */
@Service
@Slf4j
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    // ------------------------------------------------------------------ //
    //  Order creation                                                       //
    // ------------------------------------------------------------------ //

    /**
     * Creates a Razorpay order and returns its JSON representation.
     *
     * @param request DTO carrying the amount (in paise), optional currency, and the
     *                internal PGKart order-ID used as the Razorpay receipt
     * @return JSONObject containing {@code id}, {@code entity}, {@code amount}, etc.
     * @throws Exception if the Razorpay API call fails
     */
    @Override
    public JSONObject createOrder(RazorpayOrderRequest request) throws Exception {
        log.info("Creating Razorpay order for PGKart order id={}, amount={} paise",
                request.getPgkartOrderId(), request.getAmount());

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount",   request.getAmount()); // must be in paise
        orderRequest.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
        orderRequest.put("receipt",  "pgkart_" + request.getPgkartOrderId());

        Order order = client.orders.create(orderRequest);
        JSONObject result = new JSONObject(order.toString());

        log.info("Razorpay order created successfully: razorpayOrderId={}", result.optString("id"));
        return result;
    }

    // ------------------------------------------------------------------ //
    //  Signature verification                                              //
    // ------------------------------------------------------------------ //

    /**
     * Verifies the webhook/callback signature supplied by Razorpay after a successful payment.
     *
     * <p>Algorithm: {@code HMAC-SHA256(razorpayOrderId + "|" + razorpayPaymentId, keySecret)}
     * must equal the hex-encoded {@code razorpaySignature}.</p>
     *
     * @param razorpayOrderId   Razorpay order ID (e.g. {@code order_XXXXXX})
     * @param razorpayPaymentId Razorpay payment ID (e.g. {@code pay_XXXXXX})
     * @param razorpaySignature hex-encoded HMAC-SHA256 signature from the callback
     * @return {@code true} if the signature is valid, {@code false} otherwise
     */
    @Override
    public boolean verifyPaymentSignature(String razorpayOrderId,
                                          String razorpayPaymentId,
                                          String razorpaySignature) {
        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;

            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey =
                    new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);

            byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            String generatedSignature = HexFormat.of().formatHex(hash);

            boolean valid = generatedSignature.equals(razorpaySignature);
            if (!valid) {
                log.warn("Razorpay signature mismatch for orderId={}, paymentId={}",
                        razorpayOrderId, razorpayPaymentId);
            }
            return valid;
        } catch (Exception e) {
            log.error("Signature verification failed: {}", e.getMessage());
            return false;
        }
    }
}
