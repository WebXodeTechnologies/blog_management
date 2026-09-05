"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Presentation,
  Eye,
  BookOpenCheck,
  Users,
  Vote,
  Sparkles,
} from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";

export default function UserDashboardHero({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    if (!initialUser) {
      fetch("/api/v1/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [initialUser]);

  const statsValues = user?.stats || {};

  const stats = [
    {
      id: "stories",
      label: "Total Stories",
      value: loading ? "..." : (statsValues.totalStories ?? 0),
      change: `${statsValues.draftStories ?? 0} drafts`,
      icon: <FileText className="h-5 w-5 text-indigo-600" />,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "presentations",
      label: "Presentations",
      value: loading ? "..." : (statsValues.presentations ?? 0),
      change: "Slides & Demos",
      icon: <Presentation className="h-5 w-5 text-indigo-600" />,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "views",
      label: "Total Views",
      value: loading ? "..." : (statsValues.totalViews ?? 0),
      change: "Live traffic",
      icon: <Eye className="h-5 w-5 text-emerald-600" />,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "reads",
      label: "Full Reads",
      value: loading ? "..." : (statsValues.totalReads ?? 0),
      change: "68% completion",
      icon: <BookOpenCheck className="h-5 w-5 text-indigo-600" />,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "followers",
      label: "Followers",
      value: loading ? "..." : (statsValues.followers ?? "0"),
      change: "Community",
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "fanpolls",
      label: "Fan Poll Votes",
      value: loading ? "..." : (statsValues.fanPolls ?? 0),
      change: "Active polls",
      icon: <Vote className="h-5 w-5 text-amber-600" />,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Light Glassmorphic Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 overflow-hidden shadow-xl shadow-indigo-500/5 font-sans"
      >
        {/* Soft Pastel Animated Ambient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-tr from-indigo-200/50 to-sky-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-tr from-purple-200/40 to-pink-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-linear-to-tr from-cyan-100/30 via-indigo-100/30 to-purple-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-xs font-bold border border-indigo-200/80 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              <span className="capitalize">
                {user?.role || "user"} Personal Workspace
              </span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-black tracking-tight">
              Welcome back, {user?.name || "Developer"} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-xl leading-relaxed">
              Real-time analytics dashboard tracking stories, views, reads,
              follower growth, and fan poll engagement.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-black text-right hidden sm:block shadow-xs">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Account Mail
            </p>
            <p className="text-xs font-bold text-black mt-0.5">
              {user?.email || "user@texora.com"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Light Glassmorphic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -3 }}
            className="p-4 sm:p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-2xl bg-indigo-50/80 border border-indigo-100/80">
                {stat.icon}
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${stat.badgeColor}`}
              >
                {stat.change}
              </span>
            </div>

            <p className="text-xs text-slate-800 font-bold mb-1 truncate">
              {stat.label}
            </p>
            <h2 className="font-heading font-black text-2xl text-black tracking-tight">
              {stat.value}
            </h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
