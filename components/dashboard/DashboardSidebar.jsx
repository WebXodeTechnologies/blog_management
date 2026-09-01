"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  BarChart3,
  Sparkles,
  User,
  BookOpen,
  Users,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Highlighter,
  History,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  Inbox,
  LogOut,
  X,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Flag,
  CheckSquare,
} from "lucide-react";
import logo from "@/public/logos/logo2.png";

export default function DashboardSidebar({ user, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();

  const [exploreStationOpen, setExploreStationOpen] = useState(
    pathname.includes("explore-station") || pathname.includes("bookmarks")
  );
  const [storiesOpen, setStoriesOpen] = useState(pathname.includes("articles"));

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "/login";
  };

  const isModerator = user?.role === "moderator";

  const checkActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200/80 p-4 font-sans select-none">
      {/* Top Header & Brand */}
      <div className="space-y-4">
        {/* Brand Bar with Indigo SaaS Accent */}
        <div className="flex items-center justify-between px-2 pt-1 pb-3.5 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-0.5 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform overflow-hidden">
              <Image
                src={logo}
                alt="Texora Logo"
                width={36}
                height={36}
                className="rounded-xl object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-brand font-black text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Texora
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md shadow-2xs ${
                    isModerator
                      ? "bg-rose-600 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {isModerator ? "MOD" : "PRO"}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                {isModerator ? "Moderator Panel" : "Admin Workspace"}
              </span>
            </div>
          </Link>

          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-indigo-600 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Button: Write New Story */}
        <Link
          href="/dashboard/tech-pulse/blog/create"
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] border border-indigo-500 group cursor-pointer"
        >
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300 stroke-3" />
          <span>Write New Story</span>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2 overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-none">
          {/* MODERATOR DYNAMIC SECTION (Appended for Moderators) */}
          {isModerator && (
            <div className="mb-4 pb-3 border-b border-rose-100 space-y-1">
              <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 mb-2 flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                <span>Moderator Controls</span>
              </p>

              <Link
                href="/moderator"
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  checkActive("/moderator", true)
                    ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20 border border-rose-500"
                    : "text-rose-700 hover:bg-rose-50/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className={`h-4 w-4 ${checkActive("/moderator", true) ? "text-white" : "text-rose-600"}`}
                  />
                  <span>Control Center</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    checkActive("/moderator", true)
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-rose-100 text-rose-700 border-rose-200"
                  }`}
                >
                  14 Queue
                </span>
              </Link>

              <Link
                href="/moderator/queue"
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  checkActive("/moderator/queue")
                    ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20 border border-rose-500"
                    : "text-rose-700 hover:bg-rose-50/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckSquare
                    className={`h-4 w-4 ${checkActive("/moderator/queue") ? "text-white" : "text-rose-600"}`}
                  />
                  <span>Review &amp; Approve</span>
                </div>
              </Link>
            </div>
          )}

          <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
            Workspace Menu
          </p>

          {/* 1. Home / Explore */}
          <Link
            href="/explore"
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
              checkActive("/explore", true)
                ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 border border-indigo-500"
                : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <Compass
                className={`h-4 w-4 ${checkActive("/explore", true) ? "text-white" : "text-slate-500"}`}
              />
              <span>Home / Explore</span>
            </div>
          </Link>

          {/* 2. Personal Workspace (Analytics) */}
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
              checkActive("/dashboard", true)
                ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 border border-indigo-500"
                : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3
                className={`h-4 w-4 ${checkActive("/dashboard", true) ? "text-white" : "text-slate-500"}`}
              />
              <span>Personal Analytics</span>
            </div>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                checkActive("/dashboard", true)
                  ? "bg-white/20 text-white border-white/30"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
              }`}
            >
              Live
            </span>
          </Link>

          {/* 3. Explore Station (Submenu) */}
          <div>
            <button
              onClick={() => setExploreStationOpen(!exploreStationOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                pathname.includes("explore-station") ||
                pathname.includes("bookmarks")
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold"
                  : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>Explore Station</span>
              </div>
              {exploreStationOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-indigo-600" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            <AnimatePresence>
              {exploreStationOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-5 pl-3 border-l-2 border-indigo-200 pt-1.5 space-y-1 overflow-hidden"
                >
                  {[
                    {
                      label: "Your List",
                      tab: "your-list",
                      icon: <BookOpen className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Saved List",
                      href: "/bookmarks",
                      icon: <Bookmark className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Highlights",
                      tab: "highlights",
                      icon: <Highlighter className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Reading History",
                      tab: "history",
                      icon: <History className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Responses",
                      tab: "responses",
                      icon: <MessageSquare className="h-3.5 w-3.5" />,
                    },
                  ].map((sub) => {
                    const subHref =
                      sub.href || `/dashboard/explore-station?tab=${sub.tab}`;
                    const active = checkActive(subHref);
                    return (
                      <Link
                        key={sub.label}
                        href={subHref}
                        onClick={() => setMobileOpen && setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                          active
                            ? "bg-indigo-600 text-white font-bold shadow-2xs"
                            : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
                        }`}
                      >
                        {sub.icon}
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. Profile & Account */}
          <Link
            href="/dashboard/profile"
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
              checkActive("/dashboard/profile")
                ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 border border-indigo-500"
                : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <User
                className={`h-4 w-4 ${checkActive("/dashboard/profile") ? "text-white" : "text-slate-500"}`}
              />
              <span>Profile &amp; Account</span>
            </div>
          </Link>

          {/* 5. Stories & Posts (Submenu) */}
          <div>
            <button
              onClick={() => setStoriesOpen(!storiesOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                pathname.includes("articles")
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold"
                  : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span>Stories &amp; Posts</span>
              </div>
              {storiesOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-indigo-600" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            <AnimatePresence>
              {storiesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-5 pl-3 border-l-2 border-indigo-200 pt-1.5 space-y-1 overflow-hidden"
                >
                  {[
                    {
                      label: "Drafts",
                      tab: "drafts",
                      icon: <FileText className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Scheduled",
                      tab: "scheduled",
                      icon: <Clock className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Published",
                      tab: "published",
                      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Unlisted",
                      tab: "unlisted",
                      icon: <Lock className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Submissions",
                      tab: "submissions",
                      icon: <Inbox className="h-3.5 w-3.5 text-amber-500" />,
                    },
                  ].map((sub) => {
                    const subHref = `/dashboard/articles?tab=${sub.tab}`;
                    const active = checkActive(subHref);
                    return (
                      <Link
                        key={sub.label}
                        href={subHref}
                        onClick={() => setMobileOpen && setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                          active
                            ? "bg-indigo-600 text-white font-bold shadow-2xs"
                            : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
                        }`}
                      >
                        {sub.icon}
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 6. Following */}
          <Link
            href="/dashboard/following"
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
              checkActive("/dashboard/following")
                ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 border border-indigo-500"
                : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users
                className={`h-4 w-4 ${checkActive("/dashboard/following") ? "text-white" : "text-slate-500"}`}
              />
              <span>Following</span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                checkActive("/dashboard/following")
                  ? "bg-white/20 text-white border-white/30"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
              }`}
            >
              24
            </span>
          </Link>
        </nav>
      </div>

      {/* User Footer Card */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover border border-indigo-200 ring-2 ring-indigo-500/20 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="overflow-hidden text-left">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.name || "Author"}
              </p>
              <p className="text-[10px] text-indigo-600 font-semibold capitalize truncate">
                {user?.role || "user"} workspace
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs border border-rose-200 transition cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-72 max-w-full bg-white shadow-2xl z-50"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
