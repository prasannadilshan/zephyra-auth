package com.zephyra.auth.service;

import com.zephyra.auth.dto.response.AdminDashboardResponse;
import com.zephyra.auth.dto.response.UserProfileResponse;
import com.zephyra.auth.exception.ResourceNotFoundException;
import com.zephyra.auth.model.ERole;
import com.zephyra.auth.model.User;
import com.zephyra.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String usernameOrEmail) {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + usernameOrEmail));

        return toUserProfileResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserProfileResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboardStats() {
        List<User> users = userRepository.findAll();

        long totalAdmins = users.stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName() == ERole.ROLE_ADMIN))
                .count();

        List<UserProfileResponse> recentUsers = users.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::toUserProfileResponse)
                .toList();

        return AdminDashboardResponse.builder()
                .totalUsers(users.size())
                .totalAdmins(totalAdmins)
                .activeRefreshTokens(refreshTokenService.countActiveTokens())
                .recentUsers(recentUsers)
                .build();
    }

    private UserProfileResponse toUserProfileResponse(User user) {
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .toList();

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
