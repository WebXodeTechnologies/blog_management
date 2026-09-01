"use client";

import {
  Wrench,
  Shield,
  Database,
  RefreshCw,
  Key,
  AlertTriangle,
} from "lucide-react";

export default function MasterAdminToolsCard() {
  const handleAction = (actionName) => {
    alert(`Master Action executed: ${actionName}`);
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

      <div className="grid grid-cols-2 gap-3 text-xs">
        <button
          onClick={() => handleAction("Flush Redis Socket Cache")}
          className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left space-y-1.5 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <RefreshCw className="w-4 h-4 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-mono text-slate-400">FLUSH</span>
          </div>
          <p className="font-bold text-white leading-tight">
            Purge Redis Cache
          </p>
        </button>

        <button
          onClick={() => handleAction("Backup MongoDB Database")}
          className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left space-y-1.5 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono text-slate-400">BSON</span>
          </div>
          <p className="font-bold text-white leading-tight">Export DB Backup</p>
        </button>

        <button
          onClick={() => handleAction("Rotate System API Secret Keys")}
          className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left space-y-1.5 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <Key className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-mono text-slate-400">KEYS</span>
          </div>
          <p className="font-bold text-white leading-tight">
            Rotate Master Keys
          </p>
        </button>

        <button
          onClick={() => handleAction("Toggle Platform Maintenance Mode")}
          className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left space-y-1.5 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="text-[10px] font-mono text-slate-400">MAINT</span>
          </div>
          <p className="font-bold text-white leading-tight">Maintenance Mode</p>
        </button>
      </div>
    </div>
  );
}
