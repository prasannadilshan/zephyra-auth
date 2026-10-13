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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Enterprise Identity &amp; Access Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
            Secure Authentication with Role-Based Access Control
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Reliable authentication service with JWT token rotation, Spring Security, and Next.js integration.
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
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Backend Service: <strong>{health?.status === "UP" ? "Online" : "Operational"}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Core Capabilities
            </h2>
            <p className="text-sm text-slate-500">
              Engineered for reliability, data security, and seamless developer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                JWT Token Rotation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Short-lived HMAC-SHA256 access tokens with persisted refresh tokens and automatic background renewal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Role-Based Authorization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fine-grained permissions for standard users and administrators with protected routes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Enterprise Backend
              </h3>
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
