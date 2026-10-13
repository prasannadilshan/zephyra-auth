package com.zephyra.auth.controller;

import com.zephyra.auth.dto.request.UpdateUserAdminRequest;
import com.zephyra.auth.dto.response.AdminDashboardResponse;
import com.zephyra.auth.dto.response.UserProfileResponse;
import com.zephyra.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/users/{id}")
    @Operation(summary = "Update user by admin", description = "Allows administrator to update user details and roles (ADMIN only)")
    public ResponseEntity<UserProfileResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserAdminRequest request
    ) {
        UserProfileResponse updated = userService.updateUserByAdmin(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics", description = "Returns system administration metrics, user counts, and token stats")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {
        AdminDashboardResponse stats = userService.getAdminDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
