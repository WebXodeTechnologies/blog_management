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
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-3xl bg-linear-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white p-6 sm:p-8 overflow-hidden border border-indigo-500/30 shadow-xl shadow-indigo-600/20"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-white text-xs font-semibold border border-white/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span className="capitalize">
                {user?.role || "user"} Personal Workspace
              </span>
            </div>
            <h1 className="font-brand font-black text-2xl sm:text-4xl text-white tracking-tight">
              Welcome back, {user?.name || "Developer"} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
              Real-time analytics dashboard tracking stories, views, reads,
              follower growth, and fan poll engagement.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-right hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-indigo-100 tracking-wider">
              Account Mail
            </p>
            <p className="text-xs font-semibold text-white mt-0.5">
              {user?.email || "user@texora.com"}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -3 }}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-2xl bg-indigo-50 border border-indigo-100">
                {stat.icon}
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${stat.badgeColor}`}
              >
                {stat.change}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mb-1 truncate">
              {stat.label}
            </p>
            <h2 className="font-brand font-black text-2xl text-slate-900 tracking-tight">
              {stat.value}
            </h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
