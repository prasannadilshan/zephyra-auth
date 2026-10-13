package com.zephyra.auth.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthResponse {

    private String status;
    private String message;
    private String environment;
    private String databaseStatus;
    private String version;
    private Instant timestamp;
}
