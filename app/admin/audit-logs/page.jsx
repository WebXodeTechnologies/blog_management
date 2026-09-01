"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw, Loader2, Clock } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/audit-logs");
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
      } else {
        setError(data.error || "Failed to fetch audit logs");
      }
    } catch (err) {
      setError("Network error fetching audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            Security & Audit Logs
          </h1>
          <p className="text-xs text-slate-500">
            Real-time audit stream tracking administrative actions, role changes, and tenant updates.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200/80">
              <tr>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Actor</th>
                <th className="px-4 py-3.5">Target Entity</th>
                <th className="px-4 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-600 mb-2" />
                    Loading audit stream...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-400">
                    No administrative audit events recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-lg font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {log.actorId ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-[10px]">
                            {log.actorId.name?.[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-bold">{log.actorId.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{log.actorId.email}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">System Automated</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-700">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{log.entityType}</span>
                        <span className="text-[10px] text-slate-400">{log.entityId || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
