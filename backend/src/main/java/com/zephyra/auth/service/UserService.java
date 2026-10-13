package com.zephyra.auth.service;

import com.zephyra.auth.dto.request.UpdateProfileRequest;
import com.zephyra.auth.dto.request.UpdateUserAdminRequest;
import com.zephyra.auth.dto.response.AdminDashboardResponse;
import com.zephyra.auth.dto.response.UserProfileResponse;
import com.zephyra.auth.exception.BadRequestException;
import com.zephyra.auth.exception.ResourceNotFoundException;
import com.zephyra.auth.model.ERole;
import com.zephyra.auth.model.Role;
import com.zephyra.auth.model.User;
import com.zephyra.auth.repository.RoleRepository;
import com.zephyra.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenService refreshTokenService;
    private final com.zephyra.auth.security.jwt.JwtUtils jwtUtils;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String usernameOrEmail) {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + usernameOrEmail));

        return toUserProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String currentUsernameOrEmail, UpdateProfileRequest request) {
        User user = userRepository.findByUsernameOrEmail(currentUsernameOrEmail, currentUsernameOrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsernameOrEmail));

        String newUsername = request.getUsername().trim();
        String newEmail = request.getEmail().trim().toLowerCase();

        if (!user.getUsername().equalsIgnoreCase(newUsername) && userRepository.existsByUsername(newUsername)) {
            throw new BadRequestException("Username '" + newUsername + "' is already taken");
        }

        if (!user.getEmail().equalsIgnoreCase(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new BadRequestException("Email '" + newEmail + "' is already registered");
        }

        user.setUsername(newUsername);
        user.setEmail(newEmail);
        User updated = userRepository.save(user);

        List<String> roles = updated.getRoles().stream()
                .map(r -> r.getName().name())
                .toList();
        String newAccessToken = jwtUtils.generateTokenFromUsername(updated.getUsername(), roles);

        UserProfileResponse response = toUserProfileResponse(updated);
        response.setAccessToken(newAccessToken);
        return response;
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserProfileResponse)
                .toList();
    }

    @Transactional
    public UserProfileResponse updateUserByAdmin(Long userId, UpdateUserAdminRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String newUsername = request.getUsername().trim();
        String newEmail = request.getEmail().trim().toLowerCase();

        if (!user.getUsername().equalsIgnoreCase(newUsername) && userRepository.existsByUsername(newUsername)) {
            throw new BadRequestException("Username '" + newUsername + "' is already taken");
        }

        if (!user.getEmail().equalsIgnoreCase(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new BadRequestException("Email '" + newEmail + "' is already registered");
        }

        user.setUsername(newUsername);
        user.setEmail(newEmail);

        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleStr : request.getRoles()) {
                if ("admin".equalsIgnoreCase(roleStr) || "role_admin".equalsIgnoreCase(roleStr)) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMIN)));
                    roles.add(adminRole);
                } else {
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_USER)));
                    roles.add(userRole);
                }
            }
            user.setRoles(roles);
        }

        User updated = userRepository.save(user);
        return toUserProfileResponse(updated);
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
