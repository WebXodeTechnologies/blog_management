"use client";

import { useState } from "react";
import {
  Wrench,
  Shield,
  Database,
  RefreshCw,
  Key,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function MasterAdminToolsCard() {
  const [loadingAction, setLoadingAction] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleAction = async (actionType, actionName) => {
    setLoadingAction(actionType);
    setFeedback(null);
    try {
      const res = await fetch("/api/v1/admin/tools/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({
          type: "success",
          text: `${actionName} executed successfully.`,
        });
      } else {
        setFeedback({
          type: "error",
          text: data.error || `Failed to execute ${actionName}`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Network error executing root operation.",
      });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl font-sans space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Shield className="w-4.5 h-4.5 text-indigo-400" />
          Master Root System Tools
        </h2>
        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
          ROOT PRIVILEGES
        </span>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-medium border ${feedback.type === "success" ? "bg-emerald-950/60 border-emerald-800 text-emerald-300" : "bg-rose-950/60 border-rose-800 text-rose-300"}`}
        >
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-xs">
        <button
          onClick={() => handleAction("flush-redis", "Purge Redis Cache")}
          disabled={loadingAction !== null}
          className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/85 text-left space-y-1.5 transition-colors group disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            {loadingAction === "flush-redis" ? (
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
            )}
            <span className="text-[10px] font-mono text-slate-400">FLUSH</span>
          </div>
          <p className="font-bold text-white leading-tight">
            Purge Redis Cache
          </p>
        </button>

        <button
          onClick={() => handleAction("export-db", "Export DB Backup")}
          disabled={loadingAction !== null}
          className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/85 text-left space-y-1.5 transition-colors group disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            {loadingAction === "export-db" ? (
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            ) : (
              <Database className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-[10px] font-mono text-slate-400">BSON</span>
          </div>
          <p className="font-bold text-white leading-tight">Export DB Backup</p>
        </button>

        <button
          onClick={() => handleAction("rotate-keys", "Rotate Master Keys")}
          disabled={loadingAction !== null}
          className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/85 text-left space-y-1.5 transition-colors group disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            {loadingAction === "rotate-keys" ? (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <Key className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-[10px] font-mono text-slate-400">KEYS</span>
          </div>
          <p className="font-bold text-white leading-tight">
            Rotate Master Keys
          </p>
        </button>

        <button
          onClick={() => handleAction("maintenance-mode", "Maintenance Mode")}
          disabled={loadingAction !== null}
          className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/85 text-left space-y-1.5 transition-colors group disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            {loadingAction === "maintenance-mode" ? (
              <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span className="text-[10px] font-mono text-slate-400">MAINT</span>
          </div>
          <p className="font-bold text-white leading-tight">Maintenance Mode</p>
        </button>
      </div>
    </div>
  );
}
