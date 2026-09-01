"use client";

import Link from "next/link";
import { ShieldAlert, ArrowRight, Clock, ShieldCheck } from "lucide-react";

export default function SecurityAuditStreamCard() {
  const auditEvents = [
    {
      id: "AUD-991",
      action: "ROLE_ELEVATED",
      actor: "Texora Master Admin",
      details: "Elevated user dev_alex@texora.io to Moderator",
      severity: "WARN",
      time: "10 mins ago",
    },
    {
      id: "AUD-990",
      action: "TENANT_PROVISIONED",
      actor: "System Automated",
      details: "Provisioned tenant instance 'Acme Engineering'",
      severity: "INFO",
      time: "42 mins ago",
    },
    {
      id: "AUD-989",
      action: "BLOG_MODERATED",
      actor: "Texora Master Admin",
      details: "Approved article 'React 19 Server Actions'",
      severity: "INFO",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs font-sans space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          Master Security & Audit Stream
        </h2>
        <Link
          href="/admin/audit-logs"
          className="text-xs text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 transition-colors"
        >
          <span>View All Logs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {auditEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-200 text-slate-800">
                  {evt.action}
                </span>
                <span className="font-bold text-slate-900">{evt.actor}</span>
              </div>
              <p className="text-slate-600 text-[11px] font-medium">{evt.details}</p>
            </div>

            <div className="flex flex-col items-end shrink-0 text-[10px] font-mono text-slate-400">
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase ${
                  evt.severity === "WARN"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {evt.severity}
              </span>
              <span className="mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {evt.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
