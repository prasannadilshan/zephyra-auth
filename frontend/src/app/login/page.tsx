"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, UserCheck, ShieldAlert, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.push(isAdmin ? "/admin" : "/dashboard");
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!usernameOrEmail.trim() || !password) {
      setErrorMessage("Please enter both username/email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const auth = await login(usernameOrEmail.trim(), password);
      if (auth.roles.includes("ROLE_ADMIN")) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMessage(errorObj?.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (type: "admin" | "user") => {
    if (type === "admin") {
      setUsernameOrEmail("admin@zephyra.com");
      setPassword("Admin@123456");
    } else {
      setUsernameOrEmail("user@zephyra.com");
      setPassword("User@123456");
    }
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-2 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Welcome to Zephyra
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to access your secure profile & dashboard
          </p>
        </div>

        {/* Quick Fill Card for Assessors */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-200/50 dark:border-indigo-900/50 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruitment Assessment Quick-Fill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400 font-medium text-zinc-800 dark:text-zinc-200 hover:shadow-xs transition-all text-[11px]"
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-500" />
              <span>Fill Admin Account</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("user")}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400 font-medium text-zinc-800 dark:text-zinc-200 hover:shadow-xs transition-all text-[11px]"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Fill User Account</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xl shadow-zinc-950/5 backdrop-blur-xl">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-2.5 animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="admin@zephyra.com or username"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-xs text-zinc-500">
              Need a new account?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
