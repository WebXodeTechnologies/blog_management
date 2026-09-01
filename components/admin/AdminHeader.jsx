"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  Plus,
  ChevronDown,
  Building2,
  Tags,
  UserPlus,
} from "lucide-react";
import logo2 from "@/public/logos/logo2.png";

export default function AdminHeader({ user, onMobileToggle }) {
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between text-slate-900 font-sans shadow-xs">
      {/* Left Section: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={onMobileToggle}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
          aria-label="Open Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global SaaS Search Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tenants, users, articles, logs... (Ctrl + K)"
            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-9 pr-12 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 transition-all font-medium"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded border border-slate-300/60">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Section: System Health, Quick Actions, Notifications & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* User-Friendly System Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 rounded-full border border-emerald-200/80 text-xs font-semibold text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>System Operational</span>
        </div>

        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickMenuOpen(!quickMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Action</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {quickMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setQuickMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-20 font-sans text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/admin/tenants"
                  onClick={() => setQuickMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-semibold transition-colors"
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Provision New Tenant</span>
                </Link>
                <Link
                  href="/admin/categories"
                  onClick={() => setQuickMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-semibold transition-colors"
                >
                  <Tags className="w-4 h-4 text-emerald-600" />
                  <span>Add Global Category</span>
                </Link>
                <Link
                  href="/admin/users"
                  onClick={() => setQuickMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-semibold transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-purple-600" />
                  <span>Manage User Permissions</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* View Public Site Link */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-950 font-semibold transition-colors px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 border border-slate-200/60"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            aria-label="View Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-20 font-sans text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-extrabold text-slate-950">
                    Notifications
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    3 New
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-900">
                      New Tenant Provisioned
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Acme Labs requested Pro Plan activation.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-900">Pending Review</p>
                    <p className="text-[11px] text-slate-500">
                      2 articles flagged for moderation in Queue.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin User Profile Pill with Texora Logo Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-xs ring-2 ring-slate-100 shrink-0 bg-slate-950 flex items-center justify-center">
            <Image
              src={logo2}
              alt={user?.name || "Texoradmin Avatar"}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-bold text-slate-950 leading-tight">
              {user?.name || "Texora"}
            </span>
            <span className="text-[10px] text-indigo-600 font-bold">
              Master Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
