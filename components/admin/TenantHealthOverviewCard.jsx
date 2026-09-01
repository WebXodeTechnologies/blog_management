"use client";

import Link from "next/link";
import { Building2, Globe, HardDrive, ArrowRight, ShieldCheck } from "lucide-react";

export default function TenantHealthOverviewCard() {
  const tenants = [
    {
      name: "Acme Engineering",
      domain: "blog.acme.com",
      plan: "ENTERPRISE",
      storage: "4.2 GB / 20 GB",
      status: "Healthy",
    },
    {
      name: "DevPulse Labs",
      domain: "devpulse.io",
      plan: "PRO",
      storage: "1.8 GB / 10 GB",
      status: "Healthy",
    },
    {
      name: "CloudNative Tech",
      domain: "Default Subdomain",
      plan: "PRO",
      storage: "0.9 GB / 10 GB",
      status: "Healthy",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs font-sans space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          Tenant Instance Health & Storage
        </h2>
        <Link
          href="/admin/tenants"
          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition-colors"
        >
          <span>Manage Tenants</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {tenants.map((t) => (
          <div
            key={t.name}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-950 text-sm">{t.name}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-mono">
                  {t.plan}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-600" />
                  {t.domain}
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-slate-400" />
                  {t.storage}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
