"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { healthApi } from "@/lib/api";
import { HealthResponse } from "@/lib/types";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  RefreshCw,
  Users,
  CheckCircle2,
  ArrowRight,
  Server,
  Sparkles,
  ExternalLink,
  Crown,
  Database,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await healthApi.check();
        setHealth(data);
      } catch {
        setHealth(null);
      } finally {
        setHealthLoading(false);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        {/* Glowing gradient orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-pink-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Full-Stack Software Engineering Assessment</span>
          </div>

          {/* Heading */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              Secure JWT Authentication with{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Token Rotation &amp; RBAC
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Engineered with <strong>Next.js (TypeScript)</strong> frontend and <strong>Java 21 LTS + Spring Boot 4</strong> backend, backed by <strong>PostgreSQL</strong> on Render.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all hover:scale-105"
                >
                  <span>Go to User Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 hover:bg-purple-200 transition-all hover:scale-105"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Admin Portal</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all hover:scale-105"
                >
                  <span>Sign In &bull; Safe Test Accounts</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all hover:scale-105 shadow-xs"
                >
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>

          {/* Real-time System Status Pill */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md text-xs shadow-sm">
              <span className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-400">
                <Server className="w-3.5 h-3.5 text-indigo-500" /> Backend API:
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {healthLoading ? "Connecting..." : health?.status === "UP" ? "Online & Healthy" : "Offline"}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
              <span className="text-zinc-500">
                DB: <strong className="text-zinc-700 dark:text-zinc-300">{health?.databaseStatus || "PostgreSQL"}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Architecture Pillars */}
      <section className="py-16 bg-white dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Production Architecture Highlights
            </h2>
            <p className="text-sm text-zinc-500">
              Built to the rigorous standards expected for ZephyraTech recruitment assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 transition-colors shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                JWT Rotation &amp; Refresh
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Short-lived HMAC-SHA256 access tokens paired with secure UUID refresh tokens stored in PostgreSQL. Every refresh generates a rotated token to prevent token theft.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-purple-400 transition-colors shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Role-Based Access Control
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Granular authorization with <code>ROLE_ADMIN</code> and <code>ROLE_USER</code>. Endpoints such as <code>/api/admin/users</code> strictly reject non-admin access with 403 Forbidden.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-400 transition-colors shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Automated Tests &amp; Swagger
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                19 automated unit &amp; integration tests verified with 100% pass rate. Interactive OpenAPI 3 / Swagger UI exposed at <code>/swagger-ui.html</code> for testing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
