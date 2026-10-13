"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { User, Mail, Shield, CheckCircle, Users, LogOut } from "lucide-react";

export default function UserDashboardPage() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Account Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal profile and account settings
          </p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-sm">
                {user?.username?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.username}
                </h2>
                <p className="text-sm text-slate-500">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Shield className="w-3 h-3" />
                    {isAdmin ? "Administrator" : "Standard User"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Active
                  </span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
              >
                <Users className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Username
              </span>
              <p className="text-base font-semibold text-slate-900">{user?.username}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Email Address
              </span>
              <p className="text-base font-semibold text-slate-900">{user?.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Account ID
              </span>
              <p className="text-base font-semibold text-slate-900">#{user?.id}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Assigned Roles
              </span>
              <p className="text-base font-semibold text-slate-900">
                {user?.roles?.map((r) => r.replace("ROLE_", "")).join(", ") || "USER"}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
