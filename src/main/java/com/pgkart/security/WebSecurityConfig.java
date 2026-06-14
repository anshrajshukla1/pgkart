package com.pgkart.security;

import com.pgkart.model.AppRole;
import com.pgkart.model.Role;
import com.pgkart.model.User;
import com.pgkart.repositories.RoleRepository;
import com.pgkart.repositories.UserRepository;
import com.pgkart.security.jwt.AuthEntryPointJwt;
import com.pgkart.security.jwt.AuthTokenFilter;
import com.pgkart.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

import java.util.Set;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Autowired
    private org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                // Admin only
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                // Authenticated users
                .requestMatchers("/api/carts/**").authenticated()
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/reviews/**").authenticated()
                .requestMatchers("/api/addresses/**").authenticated()
                // Payments
                .requestMatchers("/api/payment/**").authenticated()
                // Everything else requires auth
                .anyRequest().authenticated()
            )
            // Security headers — using addHeaderWriter (non-deprecated in Spring Security 6.3+)
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
                .addHeaderWriter(new StaticHeadersWriter(
                    "Content-Security-Policy",
                    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://res.cloudinary.com;"))
                .addHeaderWriter(new StaticHeadersWriter(
                    "Referrer-Policy", "strict-origin-when-cross-origin"))
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    // Static/legacy Swagger paths are permitted via filterChain authorizeHttpRequests above.
    // WebSecurityCustomizer with web.ignoring() is deprecated in Spring Security 6.x.

    /**
     * Initialize default roles and admin user on startup.
     * Uses env vars for admin credentials — change in production!
     */
    @Bean
    public CommandLineRunner initData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Create roles if not present
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_USER)));

            Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_ADMIN)));

            // Create default admin if not present
            if (!userRepository.existsByUserName("pgkart_admin")) {
                User admin = new User(
                    "pgkart_admin",
                    "pgkart_admin@pgkart.in",
                    passwordEncoder.encode("PGKart@Admin2024!")
                );
                admin.setRoles(Set.of(userRole, adminRole));
                userRepository.save(admin);
            }

            if (!userRepository.existsByUserName("admin")) {
                User admin = new User(
                    "admin",
                    "admin_demo@pgkart.in",
                    passwordEncoder.encode("adminpass")
                );
                admin.setRoles(Set.of(userRole, adminRole));
                userRepository.save(admin);
            }

            // Create default user if not present
            if (!userRepository.existsByUserName("user1")) {
                User user = new User(
                    "user1",
                    "user1@pgkart.in",
                    passwordEncoder.encode("password123")
                );
                user.setRoles(Set.of(userRole));
                userRepository.save(user);
            }
        };
    }
}
