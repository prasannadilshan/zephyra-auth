"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, AuthResponse } from "@/lib/types";
import { api, authApi, userApi } from "@/lib/api";
import { useToast } from "./ToastContext";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<AuthResponse>;
  register: (data: { username: string; email: string; password: string; roles?: string[] }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateActiveUser: (updatedUser: User, newAccessToken?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { showToast } = useToast();

  const logout = useCallback(async () => {
    const currentRefresh = api.getRefreshToken();
    try {
      if (currentRefresh) {
        await authApi.logout(currentRefresh);
      }
    } catch {
    } finally {
      api.clearTokens();
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      showToast("You have been signed out", "info");
      router.push("/login");
    }
  }, [router, showToast]);

  const refreshUserProfile = useCallback(async () => {
    try {
      const profile = await userApi.getProfile();
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
    } catch {
    }
  }, []);

  const updateActiveUser = useCallback((updatedUser: User, newAccessToken?: string) => {
    setUser((prev) => {
      const merged = { ...(prev || {}), ...updatedUser };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });

    if (newAccessToken) {
      setAccessToken(newAccessToken);
      const currentRefresh = api.getRefreshToken();
      if (currentRefresh) {
        api.setTokens(newAccessToken, currentRefresh);
      }
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedAccess = api.getAccessToken();
      const storedRefresh = api.getRefreshToken();
      const storedUser = localStorage.getItem("user");

      if (storedAccess && storedRefresh) {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
          }
        }

        try {
          const profile = await userApi.getProfile();
          setUser(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        } catch {
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const handleForcedLogout = () => {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      showToast("Session expired. Please log in again.", "warning");
      router.push("/login");
    };

    window.addEventListener("auth:logout", handleForcedLogout);
    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, [router, showToast]);

  const login = async (usernameOrEmail: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const authData = await authApi.login(usernameOrEmail, password);
      api.setTokens(authData.accessToken, authData.refreshToken);
      setAccessToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);

      const userObj: User = {
        id: authData.id,
        username: authData.username,
        email: authData.email,
        roles: authData.roles,
        enabled: true,
        createdAt: new Date().toISOString(),
      };
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));

      showToast(`Welcome back, ${authData.username}!`, "success");
      return authData;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { username: string; email: string; password: string; roles?: string[] }) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      showToast(res.message || "Registration successful! You can now log in.", "success");
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!accessToken;
  const isAdmin = !!user?.roles?.includes("ROLE_ADMIN");

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshUserProfile,
        updateActiveUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
