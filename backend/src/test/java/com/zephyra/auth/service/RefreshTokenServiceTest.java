package com.zephyra.auth.service;

import com.zephyra.auth.exception.TokenRefreshException;
import com.zephyra.auth.model.RefreshToken;
import com.zephyra.auth.model.User;
import com.zephyra.auth.repository.RefreshTokenRepository;
import com.zephyra.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private User user;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(refreshTokenService, "refreshTokenDurationMs", 86400000L);
        user = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@zephyra.com")
                .build();
    }

    @Test
    void testCreateRefreshToken() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(refreshTokenRepository.findByUser(user)).thenReturn(Optional.empty());
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RefreshToken token = refreshTokenService.createRefreshToken(1L);

        assertNotNull(token);
        assertNotNull(token.getToken());
        assertEquals(user, token.getUser());
        assertTrue(token.getExpiryDate().isAfter(Instant.now()));
    }

    @Test
    void testVerifyValidExpiration() {
        RefreshToken validToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(Instant.now().plusSeconds(3600))
                .revoked(false)
                .build();

        RefreshToken verified = refreshTokenService.verifyExpiration(validToken);
        assertEquals(validToken, verified);
    }

    @Test
    void testVerifyExpiredTokenThrowsException() {
        RefreshToken expiredToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(Instant.now().minusSeconds(3600))
                .revoked(false)
                .build();

        assertThrows(TokenRefreshException.class, () -> refreshTokenService.verifyExpiration(expiredToken));
        verify(refreshTokenRepository, times(1)).delete(expiredToken);
    }

    @Test
    void testVerifyRevokedTokenThrowsException() {
        RefreshToken revokedToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(Instant.now().plusSeconds(3600))
                .revoked(true)
                .build();

        assertThrows(TokenRefreshException.class, () -> refreshTokenService.verifyExpiration(revokedToken));
        verify(refreshTokenRepository, times(1)).delete(revokedToken);
    }
}
