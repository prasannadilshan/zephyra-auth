export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface HealthResponse {
  status: string;
  message: string;
  environment: string;
  databaseStatus: string;
  version: string;
  timestamp: string;
}

export interface AdminDashboardData {
  totalUsers: number;
  totalAdmins: number;
  activeRefreshTokens: number;
  recentUsers: User[];
}

export interface UpdateProfileRequest {
  username: string;
  email: string;
}

export interface UpdateUserAdminRequest {
  username: string;
  email: string;
  enabled?: boolean;
  roles?: string[];
}

export interface ApiError {
  status?: number;
  error?: string;
  message: string;
  path?: string;
  timestamp?: string;
  validationErrors?: Record<string, string>;
}
