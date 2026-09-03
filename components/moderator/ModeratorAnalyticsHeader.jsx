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
      value: stats?.pending ?? 14,
      change: "+3 urgent items",
      icon: <Inbox className="h-5 w-5 text-indigo-600" />,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "approved",
      label: "Approved Today",
      value: stats?.approvedToday ?? 28,
      change: "Lifecycle -> Published",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "flagged",
      label: "Flagged Content",
      value: stats?.flagged ?? 3,
      change: "Requires moderator action",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "actions",
      label: "Safety Enforcement Actions",
      value: stats?.safetyActions ?? 184,
      change: "Total moderation actions",
      icon: <ShieldCheck className="h-5 w-5 text-indigo-600" />,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
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
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              <span>Platform Safety Command Center</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-black tracking-tight">
              Moderator Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-xl leading-relaxed">
              Review pending blog submissions, edit article details, approve
              high-quality technical stories, or enforce platform guidelines.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-black text-right shrink-0 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Clock className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>
                Avg Response Speed:{" "}
                <strong className="text-indigo-700 font-mono">14m</strong>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Light Glassmorphic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -3 }}
            className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden font-sans"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50/80 border border-indigo-100/80">
                {m.icon}
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}
              >
                {m.change}
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-800 font-bold mb-1">
                {m.label}
              </p>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-black tracking-tight">
                {m.value}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
