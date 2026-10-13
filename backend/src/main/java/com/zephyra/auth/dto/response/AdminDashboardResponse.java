package com.zephyra.auth.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalAdmins;
    private long activeRefreshTokens;
    private List<UserProfileResponse> recentUsers;
}
