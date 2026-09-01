"use client";

import Link from "next/link";
import {
  CreditCard,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Receipt,
  ShieldCheck,
} from "lucide-react";

export default function PaymentOverviewCard({
  mrr = "$14,850",
  arr = "$178,200",
  proCount = 42,
  enterpriseCount = 18,
  successRate = "99.4%",
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-950">
              SaaS Billing & Revenue
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Razorpay Gateway
            </span>
          </div>
        </div>

        <Link
          href="/admin/payments"
          className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 transition-colors"
        >
          <span>Billing Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary Revenue Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Est. MRR
          </span>
          <div className="text-2xl font-black text-slate-950 font-mono">
            {mrr}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24.5% MoM
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Annual ARR
          </span>
          <div className="text-2xl font-black text-slate-950 font-mono">
            {arr}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            12-Month Run Rate
          </span>
        </div>
      </div>

      {/* Plan Subscribers Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
          <span className="text-indigo-900 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            Pro Tier ($49/mo)
          </span>
          <span className="text-indigo-950 font-extrabold font-mono">
            {proCount} Active Orgs
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/80">
          <span className="text-purple-900 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            Enterprise Tier ($199/mo)
          </span>
          <span className="text-purple-950 font-extrabold font-mono">
            {enterpriseCount} Active Orgs
          </span>
        </div>
      </div>

      {/* Quick Action Buttons & Status */}
      <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-100">
        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {successRate} Success Rate
        </span>

        <Link
          href="/admin/payments"
          className="text-xs text-indigo-600 hover:text-indigo-900 font-bold flex items-center gap-1"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Transactions</span>
        </Link>
      </div>
    </div>
  );
}
