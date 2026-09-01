"use client";

import { Activity } from "lucide-react";

export default function SystemStatusCard() {
  const services = [
    { name: "MongoDB Database", status: "Connected", type: "DB Engine" },
    { name: "Redis Socket Gateway", status: "Operational", type: "WebSockets" },
    { name: "BullMQ Job Worker", status: "Active", type: "Async Queue" },
    { name: "Razorpay Webhooks", status: "Healthy", type: "Billing Engine" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 font-sans">
      <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-600" />
        System Infrastructure Status
      </h2>

      <div className="space-y-2.5 text-xs">
        {services.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
          >
            <div className="flex flex-col">
              <span className="text-slate-900 font-bold">{s.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">{s.type}</span>
            </div>
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
