package com.pgkart.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseAuthService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Firebase Web API Key for verifying the token via REST
    @Value("${firebase.api.key:AIzaSyAPAXKoH-4MCp4cU4O-AsQJLBDg6V9flkg}")
    private String firebaseApiKey;

    public Map<String, String> verifyTokenAndGetUserInfo(String idToken) {
        String url = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + firebaseApiKey;
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            String requestBody = "{\"idToken\":\"" + idToken + "\"}";
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode users = root.path("users");
                if (users.isArray() && users.size() > 0) {
                    JsonNode user = users.get(0);
                    
                    Map<String, String> userInfo = new HashMap<>();
                    userInfo.put("email", user.path("email").asText());
                    userInfo.put("displayName", user.path("displayName").asText());
                    userInfo.put("emailVerified", user.path("emailVerified").asText());
                    
                    return userInfo;
                }
            }
        } catch (Exception e) {
            log.error("Error verifying Firebase ID Token: ", e);
        }
        return null;
    }
}
