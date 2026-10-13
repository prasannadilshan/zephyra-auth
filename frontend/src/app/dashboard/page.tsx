"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { userApi } from "@/lib/api";
import {
  User as UserIcon,
  Mail,
  Shield,
  CheckCircle,
  Users,
  LogOut,
  Pencil,
  X,
  Loader2,
  AlertCircle,
  Save,
  Hash,
  KeyRound,
} from "lucide-react";

export default function UserDashboardPage() {
  const { user, isAdmin, logout, updateActiveUser } = useAuth();
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const openEditModal = () => {
    setEditUsername(user?.username || "");
    setEditEmail(user?.email || "");
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (!saving) {
      setIsEditModalOpen(false);
      setEditError(null);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    const cleanUsername = editUsername.trim();
    const cleanEmail = editEmail.trim();

    if (!cleanUsername || cleanUsername.length < 3 || cleanUsername.length > 50) {
      setEditError("Username must be between 3 and 50 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(cleanUsername)) {
      setEditError("Username can only contain alphanumeric characters, dots, underscores, and hyphens.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEditError("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    try {
      const updated = await userApi.updateProfile({
        username: editUsername.trim(),
        email: editEmail.trim(),
      });
      updateActiveUser(updated, updated.accessToken);
      showToast("Profile updated successfully!", "success");
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setEditError(errorObj?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

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
        <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 p-8 shadow-sm space-y-8">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-xs">
                {user?.username?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {user?.username}
                </h2>
                <p className="text-sm text-slate-500">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold ${
                    isAdmin
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "bg-sky-50 text-sky-700 border border-sky-200"
                  }`}>
                    <Shield className="w-3 h-3" />
                    {isAdmin ? "Administrator" : "Standard User"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openEditModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit Details</span>
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors shadow-xs"
                >
                  <Users className="w-4 h-4" />
                  <span>Admin Portal</span>
                </Link>
              )}
            </div>
          </div>

          {/* User Details Grid with Vibrant Accents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tile 1: Sky Blue */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2">
              <div className="flex items-center gap-2 text-sky-700">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Username
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900">{user?.username}</p>
            </div>

            {/* Tile 2: Indigo */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Email Address
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900">{user?.email}</p>
            </div>

            {/* Tile 3: Violet */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
              <div className="flex items-center gap-2 text-purple-700">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Hash className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Account ID
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900">#{user?.id}</p>
            </div>

            {/* Tile 4: Emerald */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Assigned Roles
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {user?.roles?.map((r) => r.replace("ROLE_", "")).join(", ") || "USER"}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Edit Details</h3>
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

            <form onSubmit={handleUpdateProfile} className="space-y-4">
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
