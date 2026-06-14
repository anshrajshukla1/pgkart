package com.pgkart.service;

import com.pgkart.exceptions.ApiException;
import com.pgkart.model.PasswordResetToken;
import com.pgkart.model.User;
import com.pgkart.repositories.PasswordResetTokenRepository;
import com.pgkart.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Transactional
    public void createPasswordResetTokenForUser(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            // Do not throw an exception to prevent email enumeration
            return;
        }

        // Delete any existing tokens for this user
        tokenRepository.deleteByUser(user);

        // Create new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken myToken = new PasswordResetToken(token, user, LocalDateTime.now().plusHours(1));
        tokenRepository.save(myToken);

        // Send email
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ApiException("Invalid or expired password reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new ApiException("Invalid or expired password reset token");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete the token so it cannot be used again
        tokenRepository.delete(resetToken);
    }
}
