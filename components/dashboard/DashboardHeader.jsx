"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  FileText,
  Bookmark,
  LogOut,
  ShieldAlert,
  Plus,
  Command,
} from "lucide-react";

export default function DashboardHeader({ user, onMobileToggle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between font-sans text-slate-900">
      {/* Left: Mobile Trigger & SaaS Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileToggle}
          className="lg:hidden p-2 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer shadow-2xs"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Tenant Breadcrumb Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="hidden sm:inline text-slate-900 font-brand font-bold">
            Texora Admin
          </span>
          <span className="hidden sm:inline text-indigo-200">/</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200 capitalize">
            {user?.role || "user"} Workspace
          </span>
        </div>
      </div>

      {/* Center: Search Input */}
      <div className="hidden md:flex items-center relative w-72">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
        <input
          type="text"
          placeholder="Search workspace & guides..."
          className="w-full pl-9 pr-10 py-2 rounded-2xl bg-indigo-50/30 border border-indigo-100 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 shadow-2xs transition"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-indigo-100 text-[10px] font-mono text-indigo-600 pointer-events-none">
          <Command className="h-2.5 w-2.5" />
          <span>K</span>
        </div>
      </div>

      {/* Right: Notifications & User Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Stripe Indigo CTA Button */}
        <Link
          href="/dashboard/write"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs border border-indigo-500 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Story</span>
        </Link>

        {/* Notifications Bell */}
        <button
          className="relative p-2 rounded-xl border border-indigo-100 bg-indigo-50/40 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100/60 transition cursor-pointer shadow-2xs"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-2xl border border-indigo-100 bg-white hover:bg-indigo-50/50 transition shadow-2xs cursor-pointer"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-xl object-cover border border-indigo-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <span className="text-xs font-bold text-slate-900 max-w-24 truncate hidden sm:inline">
              {user?.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-indigo-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-indigo-100 shadow-xl py-2 z-50 text-slate-900">
              <div className="px-4 py-2 border-b border-indigo-50">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-indigo-600 truncate font-semibold">
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-700 transition"
                >
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Profile &amp; Settings</span>
                </Link>

                <Link
                  href="/dashboard/articles"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-700 transition"
                >
                  <FileText className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Stories &amp; Posts</span>
                </Link>

                <Link
                  href="/bookmarks"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-700 transition"
                >
                  <Bookmark className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Saved Bookmarks</span>
                </Link>

                {user?.role === "moderator" && (
                  <Link
                    href="/moderator"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                  >
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                    <span>Moderator Control</span>
                  </Link>
                )}
              </div>

              <div className="border-t border-indigo-50 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
