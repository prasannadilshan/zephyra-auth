package com.zephyra.auth.controller;

import com.zephyra.auth.dto.request.UpdateProfileRequest;
import com.zephyra.auth.dto.response.UserProfileResponse;
import com.zephyra.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "User", description = "Endpoints for authenticated regular user actions")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Returns profile details of currently authenticated user")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileResponse response = userService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Updates username and email of currently authenticated user")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserProfileResponse response = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get user dashboard", description = "Returns dashboard summary data for authenticated user")
    public ResponseEntity<Map<String, Object>> getUserDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileResponse profile = userService.getProfile(userDetails.getUsername());
        Map<String, Object> dashboard = Map.of(
                "message", "Welcome to your Zephyra dashboard, " + profile.getUsername() + "!",
                "user", profile,
                "status", "ACTIVE",
                "accessibleFeatures", List.of("View Profile", "Update Security", "Activity History")
        );
        return ResponseEntity.ok(dashboard);
    }
}
