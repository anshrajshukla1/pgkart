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

    @GetMapping("/username")
    public ResponseEntity<String> currentUserName(Authentication authentication) {
        return ResponseEntity.ok(authentication != null ? authentication.getName() : "");
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
