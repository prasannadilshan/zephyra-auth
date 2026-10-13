package com.zephyra.auth.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zephyra.auth.dto.request.LoginRequest;
import com.zephyra.auth.dto.request.RegisterRequest;
import com.zephyra.auth.dto.request.TokenRefreshRequest;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static String savedRefreshToken;

    @Test
    @Order(1)
    void testRegisterNewUserSuccess() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("newtestuser")
                .email("newtestuser@zephyra.com")
                .password("Password@123")
                .roles(Set.of("user"))
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message", containsString("successfully")));
    }

    @Test
    @Order(2)
    void testRegisterDuplicateUsernameFailure() throws Exception {
        RegisterRequest duplicate = RegisterRequest.builder()
                .username("newtestuser")
                .email("different@zephyra.com")
                .password("Password@123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("already taken")));
    }

    @Test
    @Order(3)
    void testLoginSuccess() throws Exception {
        LoginRequest login = LoginRequest.builder()
                .usernameOrEmail("newtestuser")
                .password("Password@123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.username", is("newtestuser")))
                .andExpect(jsonPath("$.roles", hasItem("ROLE_USER")))
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        savedRefreshToken = jsonNode.get("refreshToken").asText();
    }

    @Test
    @Order(4)
    void testLoginBadCredentials() throws Exception {
        LoginRequest login = LoginRequest.builder()
                .usernameOrEmail("newtestuser")
                .password("WrongPassword")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("Unauthorized")));
    }

    @Test
    @Order(5)
    void testRefreshTokenSuccess() throws Exception {
        TokenRefreshRequest refreshRequest = TokenRefreshRequest.builder()
                .refreshToken(savedRefreshToken)
                .build();

        mockMvc.perform(post("/api/auth/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()));
    }

    @Test
    @Order(6)
    void testRefreshTokenInvalid() throws Exception {
        TokenRefreshRequest invalid = TokenRefreshRequest.builder()
                .refreshToken("invalid-token-12345")
                .build();

        mockMvc.perform(post("/api/auth/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", is("Forbidden")));
    }
}
