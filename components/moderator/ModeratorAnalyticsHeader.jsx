"use client";

import { motion } from "framer-motion";
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function ModeratorAnalyticsHeader({ stats }) {
  const metrics = [
    {
      id: "pending",
      label: "Pending Review Queue",
      value: stats?.pending || 14,
      change: "+3 urgent items",
      icon: <Inbox className="h-5 w-5 text-amber-600" />,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "approved",
      label: "Approved Today",
      value: stats?.approvedToday || 28,
      change: "Lifecycle -> Published",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "flagged",
      label: "Flagged Content",
      value: stats?.flagged || 3,
      change: "Requires moderator action",
      icon: <AlertTriangle className="h-5 w-5 text-rose-600" />,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      id: "actions",
      label: "Safety Enforcement Actions",
      value: stats?.safetyActions || 184,
      change: "Total moderation actions",
      icon: <ShieldCheck className="h-5 w-5 text-indigo-600" />,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  ];

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-3xl bg-linear-to-r from-rose-600 via-rose-700 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-rose-500/15 overflow-hidden border border-rose-500/30"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30">
              <ShieldCheck className="h-3.5 w-3.5 text-rose-200" />
              <span>Platform Safety Control Center</span>
            </div>
            <h1 className="font-brand font-black text-2xl sm:text-4xl text-white tracking-tight">
              Moderator Command Center
            </h1>
            <p className="text-xs sm:text-sm text-rose-50 max-w-xl leading-relaxed">
              Review pending blog submissions, edit article details, approve high-quality technical stories, or suspend guideline violations.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-xs text-white">
            <Clock className="h-3.5 w-3.5 text-emerald-300 animate-pulse" />
            <span>Avg Response Speed: <strong className="text-white font-mono">14m</strong></span>
          </div>
        </div>
      </motion.div>

      {/* Analytics Metric Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -3 }}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-2xs transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                {m.icon}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}
              >
                {m.change}
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">{m.label}</p>
              <h2 className="font-brand font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {m.value}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
