package com.zephyra.auth.controller;

import com.zephyra.auth.dto.response.AdminDashboardResponse;
import com.zephyra.auth.dto.response.UserProfileResponse;
import com.zephyra.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Endpoints restricted to users with ROLE_ADMIN authority")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    @Operation(summary = "List all registered users", description = "Returns a complete list of users registered in the system (ADMIN only)")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics", description = "Returns system administration metrics, user counts, and token stats")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {
        AdminDashboardResponse stats = userService.getAdminDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
