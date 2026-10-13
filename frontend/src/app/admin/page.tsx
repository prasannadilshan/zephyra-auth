"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { adminApi } from "@/lib/api";
import { User, AdminDashboardData } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Users,
  Shield,
  Activity,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Pencil,
  X,
  Loader2,
  Save,
  AlertCircle,
  User as UserIcon,
  Mail,
} from "lucide-react";

export default function AdminPortalPage() {
  const { user: currentUser, refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<AdminDashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");

  // Admin edit user modal states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editEnabled, setEditEnabled] = useState(true);
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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

  const openEditModal = (targetUser: User) => {
    setEditingUser(targetUser);
    setEditUsername(targetUser.username);
    setEditEmail(targetUser.email);
    setEditEnabled(targetUser.enabled);
    setEditRoles([...targetUser.roles]);
    setEditError(null);
  };

  const closeEditModal = () => {
    if (!saving) {
      setEditingUser(null);
      setEditError(null);
    }
  };

  const toggleRole = (role: string) => {
    if (editRoles.includes(role)) {
      // Must have at least one role
      if (editRoles.length > 1) {
        setEditRoles(editRoles.filter((r) => r !== role));
      }
    } else {
      setEditRoles([...editRoles, role]);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError(null);

    if (!editUsername.trim() || !editEmail.trim()) {
      setEditError("Username and email cannot be blank.");
      return;
    }

    if (editRoles.length === 0) {
      setEditError("User must have at least one assigned role.");
      return;
    }

    setSaving(true);
    try {
      await adminApi.updateUser(editingUser.id, {
        username: editUsername.trim(),
        email: editEmail.trim(),
        enabled: editEnabled,
        roles: editRoles,
      });

      showToast(`User ${editUsername} updated successfully!`, "success");
      closeEditModal();
      await loadAdminData();

      // If updating current logged in admin, sync the auth session
      if (currentUser && currentUser.id === editingUser.id) {
        await refreshUserProfile();
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setEditError(errorObj?.message || "Failed to update user details.");
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              User Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View registered users and monitor account statistics
            </p>
          </div>

          <button
            onClick={loadAdminData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-blue-600 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                Total Users
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {stats?.totalUsers ?? (loading ? "..." : 0)}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-purple-600 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
                Administrators
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {stats?.totalAdmins ?? (loading ? "..." : 0)}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-emerald-600 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Active Sessions
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {stats?.activeRefreshTokens ?? (loading ? "..." : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Users Management Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Controls */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-slate-300 rounded-full focus:outline-none focus:border-blue-500 text-slate-700 font-medium cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Administrators Only</option>
                <option value="USER">Standard Users Only</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Roles</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Created Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      {loading ? "Loading users..." : "No users matched the search criteria."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const hasAdmin = u.roles.includes("ROLE_ADMIN");
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-semibold uppercase shadow-xs ${
                            hasAdmin
                              ? "bg-gradient-to-tr from-purple-600 to-indigo-600"
                              : "bg-gradient-to-tr from-blue-600 to-cyan-600"
                          }`}>
                            {u.username.charAt(0)}
                          </div>
                          <div>
                            <div>{u.username}</div>
                            <span className="text-[10px] text-slate-400 font-normal">ID: #{u.id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-600">{u.email}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {u.roles.map((r) => (
                              <span
                                key={r}
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                  r === "ROLE_ADMIN"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                {r.replace("ROLE_", "")}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {u.enabled ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Disabled
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Initial"}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 text-xs font-semibold text-blue-700 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-colors shadow-2xs"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
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

      {/* Admin Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit User Details</h3>
                  <span className="text-xs text-slate-500">ID #{editingUser.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={50}
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                    Account Status
                  </span>
                  <span className="text-xs text-slate-500">
                    {editEnabled ? "User is active and allowed to authenticate" : "User is disabled and blocked from logging in"}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editEnabled}
                    onChange={(e) => setEditEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Roles Toggle */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                  Assigned Roles
                </span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editRoles.includes("ROLE_USER")}
                      onChange={() => toggleRole("ROLE_USER")}
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Standard User</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editRoles.includes("ROLE_ADMIN")}
                      onChange={() => toggleRole("ROLE_ADMIN")}
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Administrator</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

