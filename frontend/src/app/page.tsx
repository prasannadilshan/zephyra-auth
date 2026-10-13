"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { healthApi } from "@/lib/api";
import { HealthResponse } from "@/lib/types";
import {
  ShieldCheck,
  KeyRound,
  Users,
  Server,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await healthApi.check();
        setHealth(data);
      } catch {
        setHealth(null);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="pt-20 pb-20 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-blue-700 border border-blue-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Enterprise Identity &amp; Access Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Secure Authentication with{" "}
            <span className="text-blue-600">
              Role-Based Access Control
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Reliable authentication service with stateless JWT rotation, Spring Security, PostgreSQL, and Next.js frontend integration.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors shadow-xs"
                  >
                    <span>Admin Portal</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>

          {/* System status pill */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs"></span>
              <span>Backend Service: <strong className="text-emerald-700 font-semibold">{health?.status === "UP" ? "Online & Healthy" : "Operational"}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Core Capabilities
            </h2>
            <p className="text-sm text-slate-500">
              Engineered for reliability, data security, and seamless developer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Amber Accent */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                  Token Lifecycle
                </span>
                <h3 className="font-bold text-lg text-slate-900">
                  JWT Token Rotation
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Short-lived HMAC-SHA256 access tokens with persisted refresh tokens and automatic background renewal.
              </p>
            </div>

            {/* Card 2 - Violet Accent */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-violet-500 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 block mb-1">
                  Access Control
                </span>
                <h3 className="font-bold text-lg text-slate-900">
                  Role-Based Authorization
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fine-grained permissions for standard users and administrators with protected routes.
              </p>
            </div>

            {/* Card 3 - Emerald Accent */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Infrastructure
                </span>
                <h3 className="font-bold text-lg text-slate-900">
                  Enterprise Backend
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Java 21 LTS, Spring Boot, and PostgreSQL database providing production-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
