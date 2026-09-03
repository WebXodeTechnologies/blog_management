"use client";

import { ShieldAlert, Sparkles } from "lucide-react";

export default function ModeratorAuditStream({ logs }) {
  const defaultLogs = [
    {
      id: "LOG-8812",
      moderator: "Safety System Bot",
      action: "AUTO_FLAGGED",
      target: "Comment on 'PostgreSQL Indexing Optimization'",
      reason: "High risk keyword pattern detected (92%)",
      timestamp: "5 mins ago",
      type: "warning",
    },
    {
      id: "LOG-8811",
      moderator: "Alex Rivera (Lead Mod)",
      action: "APPROVED_POST",
      target: "Building Distributed Event Loops in Rust",
      reason: "Verified code snippets & author reputation",
      timestamp: "18 mins ago",
      type: "success",
    },
    {
      id: "LOG-8810",
      moderator: "Sarah Jenkins (Mod)",
      action: "REJECTED_SPAM",
      target: "Automated Crypto Bot Script",
      reason: "Unsolicited Commercial Promotion",
      timestamp: "42 mins ago",
      type: "neutral",
    },
    {
      id: "LOG-8809",
      moderator: "Safety System Bot",
      action: "TICKET_CREATED",
      target: "User profile @crypto_spammer_99",
      reason: "Multiple user reports submitted",
      timestamp: "1 hour ago",
      type: "warning",
    },
  ];

  const displayLogs = logs && logs.length > 0 ? logs : defaultLogs;

  return (
    <div className="relative rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 overflow-hidden shadow-xl shadow-indigo-500/5 font-sans space-y-5 text-slate-900">
      {/* Soft Pastel Animated Ambient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-tr from-indigo-200/50 to-sky-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-tr from-purple-200/40 to-pink-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-linear-to-tr from-cyan-100/30 via-indigo-100/30 to-purple-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-indigo-50 border border-indigo-100/80 text-indigo-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg sm:text-xl text-black tracking-tight">
              Real-Time Audit Stream &amp; Safety Logs
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Live audit events recorded across all multi-tenant moderation activity.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 backdrop-blur-md shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Audit Stream</span>
        </span>
      </div>

      {/* Logs Stream Container */}
      <div className="space-y-3">
        {displayLogs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {log.id}
                </span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {log.target}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Action by{" "}
                <strong className="text-slate-800">{log.moderator}</strong> •{" "}
                Reason:{" "}
                <span className="text-slate-700 font-semibold">
                  {log.reason}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                {log.timestamp}
              </span>

              {log.type === "success" && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                  {log.action}
                </span>
              )}
              {log.type === "warning" && (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                  {log.action}
                </span>
              )}
              {(log.type === "neutral" || log.type === "danger") && (
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                  {log.action}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
