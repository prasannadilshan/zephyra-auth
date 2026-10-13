package com.zephyra.auth.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private String message;
    private boolean success;
    @Builder.Default
    private Instant timestamp = Instant.now();

    public MessageResponse(String message) {
        this.message = message;
        this.success = true;
        this.timestamp = Instant.now();
    }

    public MessageResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
        this.timestamp = Instant.now();
    }
}
