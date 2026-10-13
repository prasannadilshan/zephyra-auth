"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HealthBadge } from "./HealthBadge";
import { ShieldCheck, LogOut, Menu, X, LayoutDashboard, Users } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Zephyra
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Home
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive("/dashboard")
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActive("/admin")
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3">
            <HealthBadge />

            {/* User status & Auth CTAs */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold uppercase">
                    {user?.username?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">
                      {user?.username}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium leading-tight">
                      {isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-slate-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-full text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2 rounded-full text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2 rounded-full text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Admin
                </Link>
              )}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">
                  {user?.username} ({isAdmin ? "Admin" : "User"})
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-sm font-medium text-rose-600 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-full text-sm font-medium border border-slate-300 text-slate-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
