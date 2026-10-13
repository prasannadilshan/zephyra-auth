package com.zephyra.auth.controller;

import com.zephyra.auth.dto.request.LoginRequest;
import com.zephyra.auth.dto.request.RegisterRequest;
import com.zephyra.auth.dto.request.TokenRefreshRequest;
import com.zephyra.auth.dto.response.AuthResponse;
import com.zephyra.auth.dto.response.MessageResponse;
import com.zephyra.auth.dto.response.TokenRefreshResponse;
import com.zephyra.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, token refresh, and logout")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user with username or email and returns access token and refresh token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Operation(summary = "Register user", description = "Registers a new user account with specified roles")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        MessageResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token", description = "Issues a new JWT access token using a valid refresh token with token rotation")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        TokenRefreshResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidates and revokes the refresh token")
    public ResponseEntity<MessageResponse> logout(@RequestBody(required = false) TokenRefreshRequest request) {
        String token = (request != null) ? request.getRefreshToken() : null;
        MessageResponse response = authService.logout(token);
        return ResponseEntity.ok(response);
    }
}
