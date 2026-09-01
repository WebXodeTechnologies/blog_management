"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Download,
  Building2,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";

export default function AdminPaymentsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/payments");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        setError(json.error || "Failed to load payment data");
      }
    } catch (err) {
      setError("Network error loading payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const planCounts = data?.planCounts || { free: 0, pro: 0, enterprise: 0 };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            Revenue & Subscription Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Monitor Razorpay payment transactions, monthly recurring revenue (MRR), and SaaS subscription tiers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-md shadow-slate-950/10 transition-all">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Monthly Recurring Revenue (MRR)"
          value={loading ? "..." : data?.mrr || "$0"}
          trend="+18.4%"
          accentColor="emerald"
          icon={DollarSign}
          badge="Razorpay Live"
        />
        <StatCard
          title="Annual Run Rate (ARR)"
          value={loading ? "..." : data?.arr || "$0"}
          trend="+22.1%"
          accentColor="indigo"
          icon={TrendingUp}
        />
        <StatCard
          title="Pro Plan Orgs ($49/mo)"
          value={loading ? "..." : `${planCounts.pro} Tenants`}
          accentColor="purple"
          icon={Building2}
        />
        <StatCard
          title="Enterprise Orgs ($199/mo)"
          value={loading ? "..." : `${planCounts.enterprise} Tenants`}
          accentColor="blue"
          icon={Users}
        />
      </div>

      {/* Grid: Plan Distribution & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Recent Razorpay Transactions
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Live Gateway Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-200/80">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Transaction ID</th>
                  <th className="px-4 py-3">Tenant Organization</th>
                  <th className="px-4 py-3">Plan Tier</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      Loading transactions...
                    </td>
                  </tr>
                ) : data?.recentTransactions?.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-900">
                      {tx.id}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {tx.tenant}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {tx.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-black text-slate-950 font-mono">
                      {tx.amount}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription Plan Breakdown Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-950">
            Subscription Plan Tiers
          </h2>

          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-700">Free Tier</span>
                <span className="text-slate-900 font-mono">{planCounts.free} Orgs</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full w-3/4" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-indigo-900">Pro Plan ($49/mo)</span>
                <span className="text-indigo-700 font-mono">{planCounts.pro} Orgs</span>
              </div>
              <div className="w-full h-2 rounded-full bg-indigo-200 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-2/3" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-purple-900">Enterprise ($199/mo)</span>
                <span className="text-purple-700 font-mono">{planCounts.enterprise} Orgs</span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-200 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
