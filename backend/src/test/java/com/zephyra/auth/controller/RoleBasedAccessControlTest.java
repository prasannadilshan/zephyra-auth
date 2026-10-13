package com.zephyra.auth.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zephyra.auth.dto.request.LoginRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@org.springframework.transaction.annotation.Transactional
class RoleBasedAccessControlTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String userToken;
    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        LoginRequest userLogin = LoginRequest.builder()
                .usernameOrEmail("user")
                .password("User@123456")
                .build();

        MvcResult userResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userLogin)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode userJson = objectMapper.readTree(userResult.getResponse().getContentAsString());
        userToken = userJson.get("accessToken").asText();

        LoginRequest adminLogin = LoginRequest.builder()
                .usernameOrEmail("admin")
                .password("Admin@123456")
                .build();

        MvcResult adminResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminLogin)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode adminJson = objectMapper.readTree(adminResult.getResponse().getContentAsString());
        adminToken = adminJson.get("accessToken").asText();
    }

    @Test
    void testPublicHealthCheckAccessibleWithoutToken() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));
    }

    @Test
    void testUserProfileWithoutTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testUserProfileWithUserTokenReturnsSuccess() throws Exception {
        mockMvc.perform(get("/api/user/profile")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("user")));
    }

    @Test
    void testAdminEndpointWithUserTokenReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAdminEndpointWithAdminTokenReturnsSuccess() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateUserProfileWithUserTokenReturnsSuccess() throws Exception {
        com.zephyra.auth.dto.request.UpdateProfileRequest updateRequest =
                com.zephyra.auth.dto.request.UpdateProfileRequest.builder()
                        .username("user")
                        .email("updated_user@zephyra.com")
                        .build();

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/user/profile")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("user")))
                .andExpect(jsonPath("$.email", is("updated_user@zephyra.com")));
    }
}
