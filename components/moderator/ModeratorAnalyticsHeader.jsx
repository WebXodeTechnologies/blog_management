"use client";

import { motion } from "framer-motion";
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

export default function ModeratorAnalyticsHeader({ stats }) {
  const metrics = [
    {
      id: "pending",
      label: "Pending Review Queue",
      value: stats?.pending || 14,
      change: "+3 urgent items",
      icon: <Inbox className="h-5 w-5 text-indigo-600" />,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
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
      icon: <AlertTriangle className="h-5 w-5 text-slate-700" />,
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
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
      {/* Platform Banner (Unified Indigo Slate Palette) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-md border border-indigo-500/20 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold border border-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-300" />
              <span>Platform Safety Command Center</span>
            </div>
            <h1 className="font-sans font-black text-2xl sm:text-4xl text-white tracking-tight">
              Moderator Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Review pending blog submissions, edit article details, approve high-quality technical stories, or enforce platform guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white shrink-0">
            <Clock className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
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
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {m.value}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
