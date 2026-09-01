"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Ticket,
  Clock,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";

export default function AdminModeratorsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchModeratorQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/moderators");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        setError(json.error || "Failed to load moderator queue");
      }
    } catch (err) {
      setError("Network error loading moderator queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModeratorQueue();
  }, []);

  const queueStats = data?.queueStats || {
    pendingReviews: 0,
    flaggedComments: 0,
    openTickets: 0,
    resolvedToday: 0,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Moderator Control & Operations Center
          </h1>
          <p className="text-xs text-slate-500">
            Monitor flagged items, open support tickets, and manage assigned platform moderators.
          </p>
        </div>

        <button
          onClick={fetchModeratorQueue}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Moderation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pending Content Reviews"
          value={loading ? "..." : `${queueStats.pendingReviews} Items`}
          accentColor="amber"
          icon={AlertTriangle}
        />
        <StatCard
          title="Flagged Comments"
          value={loading ? "..." : `${queueStats.flaggedComments} Comments`}
          accentColor="rose"
          icon={ShieldAlert}
        />
        <StatCard
          title="Open Support Tickets"
          value={loading ? "..." : `${queueStats.openTickets} Tickets`}
          accentColor="purple"
          icon={Ticket}
        />
        <StatCard
          title="Resolved Today"
          value={loading ? "..." : `${queueStats.resolvedToday} Tickets`}
          trend="+14 today"
          accentColor="emerald"
          icon={CheckCircle2}
        />
      </div>

      {/* Grid: Support Tickets & Assigned Moderators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support Tickets Queue */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-purple-600" />
              Active Support & Safety Tickets
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Queue Stream</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-200/80">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Ticket ID</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Reporter</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      Loading tickets...
                    </td>
                  </tr>
                ) : data?.tickets?.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-900">
                      {t.id}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 max-w-xs truncate">
                      {t.subject}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      {t.reporter}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.priority === "urgent"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : t.priority === "high"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.status === "open"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : t.status === "resolved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assigned Platform Moderators List */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            Assigned Moderators
          </h2>

          <div className="space-y-3 font-sans">
            {loading ? (
              <div className="py-8 text-center text-slate-400">Loading moderators...</div>
            ) : data?.moderators?.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-center text-xs font-medium">
                No moderators assigned yet.
              </div>
            ) : (
              data?.moderators?.map((mod) => (
                <div
                  key={mod._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {mod.name?.[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-slate-900">{mod.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{mod.email}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                    Active Mod
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
