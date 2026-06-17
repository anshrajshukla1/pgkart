package com.pgkart.controller;

import com.pgkart.exceptions.ApiException;
import com.pgkart.model.AppRole;
import com.pgkart.model.Role;
import com.pgkart.model.User;
import com.pgkart.repositories.RoleRepository;
import com.pgkart.repositories.UserRepository;
import com.pgkart.security.jwt.JwtUtils;
import com.pgkart.security.request.LoginRequest;
import com.pgkart.security.request.SignupRequest;
import com.pgkart.security.response.MessageResponse;
import com.pgkart.security.response.UserInfoResponse;
import com.pgkart.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final com.pgkart.service.PasswordResetService passwordResetService;
    private final com.pgkart.service.FirebaseAuthService firebaseAuthService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new UserInfoResponse(
                    userDetails.getId(), userDetails.getUsername(),
                    userDetails.getEmail(), roles, jwtToken));
        } catch (BadCredentialsException e) {
            // Generic message to prevent user enumeration
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Invalid username or password"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use"));
        }

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword())
        );

        // Only allow ROLE_USER for public signup — no admin self-registration
        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseThrow(() -> new ApiException("Error: Role not found"));
        user.setRoles(Set.of(userRole));
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody com.pgkart.security.request.ForgotPasswordRequest request) {
        passwordResetService.createPasswordResetTokenForUser(request.getEmail());
        return ResponseEntity.ok(new MessageResponse("If an account with that email exists, a password reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody com.pgkart.security.request.ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse("Password successfully reset"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@Valid @RequestBody com.pgkart.security.request.GoogleAuthRequest request) {
        java.util.Map<String, String> userInfo = firebaseAuthService.verifyTokenAndGetUserInfo(request.getIdToken());
        if (userInfo == null || userInfo.get("email") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Invalid Google token"));
        }

        String email = userInfo.get("email");
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            user = new User(email, email, encoder.encode(java.util.UUID.randomUUID().toString()));
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(() -> new ApiException("Error: Role not found"));
            user.setRoles(Set.of(userRole));
            userRepository.save(user);
        }

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new UserInfoResponse(
                userDetails.getId(), userDetails.getUsername(),
                userDetails.getEmail(), roles, jwtToken));
    }

    @GetMapping("/username")
    public ResponseEntity<String> currentUserName(Authentication authentication) {
        return ResponseEntity.ok(authentication != null ? authentication.getName() : "");
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(Authentication authentication, @Valid @RequestBody com.pgkart.security.request.UpdatePasswordRequest request) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("User not authenticated"));
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ApiException("User not found"));

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Incorrect old password"));
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password updated successfully"));
    }

    @GetMapping("/user")
    public ResponseEntity<UserInfoResponse> getUserDetails(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new UserInfoResponse(
                userDetails.getId(), userDetails.getUsername(),
                userDetails.getEmail(), roles, null));
    }
}
