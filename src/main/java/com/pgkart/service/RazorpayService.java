package com.pgkart.service;

import com.pgkart.payload.RazorpayOrderRequest;
import org.json.JSONObject;

public interface RazorpayService {
    JSONObject createOrder(RazorpayOrderRequest request) throws Exception;
    boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature);
}
