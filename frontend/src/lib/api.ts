import { AuthResponse, TokenRefreshResponse, User, AdminDashboardData, HealthResponse, ApiError } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

class ApiClient {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  public getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  public getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  public clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  public async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const token = this.getAccessToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // If token expired (401) and not already trying to refresh or login
      if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh-token")) {
        const refreshToken = this.getRefreshToken();

        if (refreshToken) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              const refreshResult = await this.refreshTokenRequest(refreshToken);
              this.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
              this.isRefreshing = false;
              this.onRefreshed(refreshResult.accessToken);
            } catch (refreshErr) {
              this.isRefreshing = false;
              this.clearTokens();
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("auth:logout"));
              }
              throw refreshErr;
            }
          }

          // Wait for the active refresh to finish, then retry original request
          const retryWithNewToken = await new Promise<string>((resolve) => {
            this.addRefreshSubscriber((newToken) => resolve(newToken));
          });

          headers.set("Authorization", `Bearer ${retryWithNewToken}`);
          const retryResponse = await fetch(url, { ...options, headers });
          return this.handleResponse<T>(retryResponse);
        } else {
          this.clearTokens();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:logout"));
          }
        }
      }

      return this.handleResponse<T>(response);
    } catch (err: unknown) {
      if ((err as ApiError)?.message) {
        throw err;
      }
      throw {
        message: "Network error: Unable to connect to the authentication backend. Please ensure the server is online.",
      } as ApiError;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("Content-Type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        error: response.statusText,
        message: data?.message || (typeof data === "string" ? data : "Request failed"),
        validationErrors: data?.validationErrors,
        path: data?.path,
      };
      throw error;
    }

    return data as T;
  }

  private async refreshTokenRequest(refreshToken: string): Promise<TokenRefreshResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Session expired. Please log in again.");
    }

    return response.json();
  }
}

export const api = new ApiClient();

// High level API helpers
export const authApi = {
  login: (usernameOrEmail: string, password: string): Promise<AuthResponse> =>
    api.fetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ usernameOrEmail, password }),
    }),

  register: (data: { username: string; email: string; password: string; roles?: string[] }) =>
    api.fetch<{ message: string; success: boolean }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  refreshToken: (refreshToken: string): Promise<TokenRefreshResponse> =>
    api.fetch<TokenRefreshResponse>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (refreshToken?: string | null) =>
    api.fetch<{ message: string; success: boolean }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),
};

export const userApi = {
  getProfile: (): Promise<User> => api.fetch<User>("/user/profile"),
  updateProfile: (data: { username: string; email: string }): Promise<User> =>
    api.fetch<User>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getDashboard: (): Promise<Record<string, unknown>> => api.fetch<Record<string, unknown>>("/user/dashboard"),
};

export const adminApi = {
  getUsers: (): Promise<User[]> => api.fetch<User[]>("/admin/users"),
  updateUser: (id: number, data: { username: string; email: string; enabled?: boolean; roles?: string[] }): Promise<User> =>
    api.fetch<User>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getDashboard: (): Promise<AdminDashboardData> => api.fetch<AdminDashboardData>("/admin/dashboard"),
};

export const healthApi = {
  check: (): Promise<HealthResponse> => api.fetch<HealthResponse>("/health"),
};
