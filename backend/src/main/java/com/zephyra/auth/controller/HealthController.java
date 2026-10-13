package com.zephyra.auth.controller;

import com.zephyra.auth.dto.response.HealthResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@Tag(name = "Health Check", description = "Public service health and status monitoring")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    @Value("${spring.application.name:zephyra-auth}")
    private String applicationName;

    @GetMapping({"/api/health", "/health"})
    @Operation(summary = "System health check", description = "Returns system operational status, database connectivity, and timestamp")
    public ResponseEntity<HealthResponse> healthCheck() {
        String dbStatus;
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            dbStatus = "CONNECTED";
        } catch (Exception e) {
            dbStatus = "UNAVAILABLE (" + e.getMessage() + ")";
        }

        HealthResponse response = HealthResponse.builder()
                .status("UP")
                .message("Zephyra Auth Service is healthy and operational")
                .environment(applicationName)
                .databaseStatus(dbStatus)
                .version("1.0.0")
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(response);
    }
}
