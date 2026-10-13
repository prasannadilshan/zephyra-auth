package com.zephyra.auth.service;

import com.zephyra.auth.dto.request.LoginRequest;
import com.zephyra.auth.dto.request.RegisterRequest;
import com.zephyra.auth.dto.request.TokenRefreshRequest;
import com.zephyra.auth.dto.response.AuthResponse;
import com.zephyra.auth.dto.response.MessageResponse;
import com.zephyra.auth.dto.response.TokenRefreshResponse;
import com.zephyra.auth.exception.BadRequestException;
import com.zephyra.auth.exception.TokenRefreshException;
import com.zephyra.auth.model.ERole;
import com.zephyra.auth.model.RefreshToken;
import com.zephyra.auth.model.Role;
import com.zephyra.auth.model.User;
import com.zephyra.auth.repository.RoleRepository;
import com.zephyra.auth.repository.UserRepository;
import com.zephyra.auth.security.jwt.JwtUtils;
import com.zephyra.auth.security.services.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public AuthResponse authenticate(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String accessToken = jwtUtils.generateJwtToken(authentication);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtUtils.getExpirationMs())
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional
    public MessageResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_USER)));
        roles.add(userRole);

        User user = User.builder()
                .username(registerRequest.getUsername().trim())
                .email(registerRequest.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(roles)
                .enabled(true)
                .build();

        userRepository.save(user);

        return new MessageResponse("User registered successfully");
    }

    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    List<String> roles = user.getRoles().stream()
                            .map(role -> role.getName().name())
                            .toList();

                    String newAccessToken = jwtUtils.generateTokenFromUsername(user.getUsername(), roles);
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());

                    return TokenRefreshResponse.builder()
                            .accessToken(newAccessToken)
                            .refreshToken(newRefreshToken.getToken())
                            .tokenType("Bearer")
                            .expiresIn(jwtUtils.getExpirationMs())
                            .build();
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token not found in database"));
    }

    @Transactional
    public MessageResponse logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }
        return new MessageResponse("Log out successful");
    }
}
