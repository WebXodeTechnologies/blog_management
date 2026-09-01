"use client";

import { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";

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
      type: "danger",
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

  const displayLogs = logs || defaultLogs;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 font-sans text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-purple-400" />
          <h3 className="font-heading font-bold text-base text-white">
            Real-Time Audit Stream &amp; Safety Logs
          </h3>
        </div>

        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Live Audit Stream
        </span>
      </div>

      <div className="space-y-3">
        {displayLogs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-500 font-bold">
                  {log.id}
                </span>
                <span className="font-semibold text-white">{log.target}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Action by <strong className="text-slate-200">{log.moderator}</strong> • Reason: <span className="text-slate-300">{log.reason}</span>
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="text-[10px] text-slate-500">{log.timestamp}</span>

              {log.type === "success" && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                  {log.action}
                </span>
              )}
              {log.type === "warning" && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] border border-amber-500/20">
                  {log.action}
                </span>
              )}
              {log.type === "danger" && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold text-[10px] border border-rose-500/20">
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
