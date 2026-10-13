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
} from "lucide-react";

export default function UserDashboardPage() {
  const { user, isAdmin, logout, refreshUserProfile } = useAuth();
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

    if (!editUsername.trim() || !editEmail.trim()) {
      setEditError("Username and email are required.");
      return;
    }

    setSaving(true);
    try {
      await userApi.updateProfile({
        username: editUsername.trim(),
        email: editEmail.trim(),
      });
      await refreshUserProfile();
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

            <div className="flex items-center gap-3">
              <button
                onClick={openEditModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-sm font-semibold transition-colors shadow-xs"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit Details</span>
              </button>

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
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Update Information</span>
            </button>

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
