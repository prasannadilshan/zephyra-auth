"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { userApi, adminApi, authApi, api } from "@/lib/api";
import {
  ShieldCheck,
  User,
  Key,
  RefreshCw,
  Copy,
  Check,
  Crown,
  Lock,
  Calendar,
  Layers,
  ArrowRight,
  Code2,
  Terminal,
  ShieldAlert,
} from "lucide-react";

export default function UserDashboardPage() {
  const { user, accessToken, refreshToken, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [apiResponse, setApiResponse] = useState<unknown | null>(null);
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    showToast(`${label} copied to clipboard`, "info");
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleManualRefresh = async () => {
    const currentRefresh = api.getRefreshToken();
    if (!currentRefresh) {
      showToast("No refresh token available", "error");
      return;
    }

    setRefreshing(true);
    try {
      const res = await authApi.refreshToken(currentRefresh);
      api.setTokens(res.accessToken, res.refreshToken);
      showToast("Token refreshed & rotated successfully! New tokens active.", "success");
      // trigger page state update
      window.location.reload();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showToast(errorObj?.message || "Token refresh failed", "error");
    } finally {
      setRefreshing(false);
    }
  };

  const testEndpoint = async (endpoint: string) => {
    setTestingEndpoint(endpoint);
    setApiResponse(null);

    try {
      let data;
      if (endpoint === "/api/user/profile") {
        data = await userApi.getProfile();
      } else if (endpoint === "/api/user/dashboard") {
        data = await userApi.getDashboard();
      } else if (endpoint === "/api/admin/users") {
        data = await adminApi.getUsers();
      }
      setApiResponse(data);
      showToast(`200 OK from ${endpoint}`, "success");
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      setApiResponse(err);
      showToast(`${errorObj?.status || 403}: ${errorObj?.message || "Forbidden"}`, "warning");
    } finally {
      setTestingEndpoint(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* User Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 p-6 sm:p-10 text-white shadow-xl shadow-indigo-950/10 border border-indigo-800/40">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30 uppercase">
                {user?.username?.charAt(0) || "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Welcome, {user?.username}!
                  </h1>
                  {isAdmin && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      <Crown className="w-3 h-3 text-amber-400" /> Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-indigo-200 mt-1">
                  {user?.email} &bull; User ID: #{user?.id}
                </p>
              </div>
            </div>

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 text-sm font-semibold transition-all hover:scale-105"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                Go to Admin Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Token Inspector & Rotation (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live JWT Inspection Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Active JWT Tokens & Security
                  </h2>
                </div>
                <button
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-colors disabled:opacity-50"
                  title="Exchange current refresh token for fresh tokens with rotation"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  <span>Rotate Tokens Now</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Access Token */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Access Token (Bearer &bull; Short-lived)
                    </span>
                    <button
                      onClick={() => handleCopy(accessToken || "", "Access Token")}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      {copiedToken === "Access Token" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-zinc-700 dark:text-zinc-300 break-all bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 max-h-20 overflow-y-auto">
                    {accessToken || "No active access token"}
                  </div>
                </div>

                {/* Refresh Token */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Refresh Token (UUID &bull; Persisted in PostgreSQL)
                    </span>
                    <button
                      onClick={() => handleCopy(refreshToken || "", "Refresh Token")}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      {copiedToken === "Refresh Token" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-zinc-700 dark:text-zinc-300 break-all bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    {refreshToken || "No active refresh token"}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Protected Endpoint Tester */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Live API Endpoint Tester
                </h2>
              </div>
              <p className="text-xs text-zinc-500 mb-4">
                Test protected backend endpoints directly from the browser using your authenticated Bearer token:
              </p>

              <div className="flex flex-wrap gap-2.5 mb-4">
                <button
                  onClick={() => testEndpoint("/api/user/profile")}
                  disabled={!!testingEndpoint}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                >
                  GET /api/user/profile (User Only)
                </button>

                <button
                  onClick={() => testEndpoint("/api/user/dashboard")}
                  disabled={!!testingEndpoint}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  GET /api/user/dashboard (User Only)
                </button>

                <button
                  onClick={() => testEndpoint("/api/admin/users")}
                  disabled={!!testingEndpoint}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
                  title="Should succeed for admin, or return 403 Forbidden for standard user"
                >
                  GET /api/admin/users (Requires ROLE_ADMIN)
                </button>
              </div>

              {/* Response output */}
              {!!apiResponse && (
                <div className="rounded-xl bg-zinc-950 text-zinc-100 p-4 font-mono text-xs overflow-x-auto max-h-60 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Response Payload:</span>
                    <button
                      onClick={() => setApiResponse(null)}
                      className="text-zinc-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                  <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: User Profile & Security Attributes */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" /> Profile Details
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Username</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user?.username}</span>
                </div>

                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Email</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user?.email}</span>
                </div>

                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">
                    Granted Authorities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          role === "ROLE_ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        }`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Account Status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active &amp; Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment Quick Guide Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/10 border border-indigo-200/50 dark:border-indigo-900/50 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Security Assessment Verification</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                When you click <strong>Rotate Tokens Now</strong>, the frontend calls{" "}
                <code>/api/auth/refresh-token</code>. The backend verifies the refresh token, revokes it, and returns a new Access + Refresh token pair.
              </p>
              <div className="pt-2 border-t border-indigo-200/30 dark:border-indigo-800/30">
                <span className="text-[11px] text-zinc-500 block">
                  Next.js interceptor automatically retries failed 401 requests with silent background refresh.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
