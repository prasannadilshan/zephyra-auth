package com.zephyra.auth.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000L);
    }

    @Test
    void testGenerateAndValidateJwtToken() {
        String token = jwtUtils.generateTokenFromUsername("testuser", List.of("ROLE_USER"));
        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("testuser", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    void testInvalidJwtToken() {
        assertFalse(jwtUtils.validateJwtToken("invalid.token.here"));
    }

    @Test
    void testExpiredJwtToken() {
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -1000L);
        String token = jwtUtils.generateTokenFromUsername("expireduser", List.of("ROLE_USER"));
        assertFalse(jwtUtils.validateJwtToken(token));
    }
}
