"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { adminApi } from "@/lib/api";
import { User, AdminDashboardData } from "@/lib/types";
import { useToast } from "@/context/ToastContext";
import {
  Crown,
  Users,
  ShieldCheck,
  Key,
  Database,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminPortalPage() {
  const { showToast } = useToast();

  const [stats, setStats] = useState<AdminDashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showToast(errorObj?.message || "Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "ALL" ||
      (filterRole === "ADMIN" && u.roles.includes("ROLE_ADMIN")) ||
      (filterRole === "USER" && !u.roles.includes("ROLE_ADMIN"));

    return matchesSearch && matchesRole;
  });

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <Crown className="w-5 h-5 text-amber-500" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Admin Control Center
              </h1>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Restricted to users with <code>ROLE_ADMIN</code> authority &bull; Real-time system monitoring
            </p>
          </div>

          <button
            onClick={loadAdminData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Total Users
              </span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats?.totalUsers ?? (loading ? "..." : 0)}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Total Administrators
              </span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats?.totalAdmins ?? (loading ? "..." : 0)}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Active Refresh Tokens
              </span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats?.activeRefreshTokens ?? (loading ? "..." : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Users Management Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Table Controls */}
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="py-2 px-3 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-zinc-700 dark:text-zinc-200"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admins Only</option>
                <option value="USER">Standard Users Only</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Roles</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400 text-xs">
                      {loading ? "Loading users from backend..." : "No users matched the criteria."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const hasAdmin = u.roles.includes("ROLE_ADMIN");
                    return (
                      <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                            {u.username.charAt(0)}
                          </div>
                          <div>
                            <div>{u.username}</div>
                            <span className="text-[10px] text-zinc-400">ID: #{u.id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-xs">{u.email}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {u.roles.map((r) => (
                              <span
                                key={r}
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  r === "ROLE_ADMIN"
                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                }`}
                              >
                                {r.replace("ROLE_", "")}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-zinc-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Initial"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
