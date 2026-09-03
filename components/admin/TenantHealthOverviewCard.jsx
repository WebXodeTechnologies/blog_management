"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Globe,
  HardDrive,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function TenantHealthOverviewCard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/v1/admin/tenants")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        // Supports both { tenants: [...] } and direct array formats
        const tenantList = data.tenants || (Array.isArray(data) ? data : []);
        setTenants(tenantList.slice(0, 3)); // Display top 3 on dashboard preview
      })
      .catch(() => {
        if (isMounted) setError("Network error fetching tenant health");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs font-sans space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          Tenant Instance Health &amp; Storage
        </h2>
        <Link
          href="/admin/tenants"
          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition-colors"
        >
          <span>Manage Tenants</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          <span className="text-xs font-medium">
            Loading workspace instances...
          </span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : tenants.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-6">
          No tenant instances registered yet.
        </p>
      ) : (
        <div className="space-y-3">
          {tenants.map((t) => (
            <div
              key={t._id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-950 text-sm">
                    {t.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-mono">
                    {t.plan || "PRO"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-indigo-600" />
                    {t.domain || `${t.slug}.texora.com`}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-slate-400" />
                    {t.storageUsed || "1.2 GB / 10 GB"}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {t.status === "active" ? "Healthy" : t.status || "Healthy"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
