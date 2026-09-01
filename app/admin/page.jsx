"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Building2,
  FileText,
  Tags,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowRight,
  Activity,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import RecentActivityTable from "@/components/admin/RecentActivityTable";
import SystemStatusCard from "@/components/admin/SystemStatusCard";
import PaymentOverviewCard from "@/components/admin/PaymentOverviewCard";
import AnalyticsChartCard from "@/components/admin/AnalyticsChartCard";
import ContentDistributionCard from "@/components/admin/ContentDistributionCard";
import SecurityAuditStreamCard from "@/components/admin/SecurityAuditStreamCard";
import TenantHealthOverviewCard from "@/components/admin/TenantHealthOverviewCard";
import MasterAdminToolsCard from "@/components/admin/MasterAdminToolsCard";
import logo2 from "@/public/logos/logo2.png";

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30d");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/stats");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        setError(json.error || "Failed to load statistics");
      }
    } catch (err) {
      setError("Network error fetching statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = data?.stats || {
    totalUsers: 0,
    totalTenants: 0,
    totalBlogs: 0,
    totalCategories: 0,
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Executive SaaS Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-slate-950 via-indigo-600 to-emerald-500" />

        <div className="flex items-center gap-4 pt-1">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-950 flex items-center justify-center shrink-0 ring-4 ring-slate-100">
            <Image
              src={logo2}
              alt="Texora Master Logo"
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                Texora Master Control Portal
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Root Systems Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
              Master control panel for multi-tenant SaaS organizations, Razorpay
              revenue streams, moderation operations, and root infrastructure.
            </p>
          </div>
        </div>

        {/* Date Selector & Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80 text-xs font-medium">
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeRange === "30d"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange("90d")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeRange === "90d"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setTimeRange("1y")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeRange === "1y"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              1 Year
            </button>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/tenants"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-md shadow-slate-950/10 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Provision Tenant</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Est. Monthly Revenue (MRR)"
          value="$14,850"
          trend="+24.5%"
          accentColor="emerald"
          icon={DollarSign}
          badge="Razorpay"
        />
        <StatCard
          title="Active Readers & Authors"
          value={loading ? "..." : stats.totalUsers}
          trend="+18.2%"
          accentColor="indigo"
          icon={Users}
        />
        <StatCard
          title="Active SaaS Tenants"
          value={loading ? "..." : stats.totalTenants}
          trend="+4 new"
          accentColor="purple"
          icon={Building2}
          badge="Multi-Tenant"
        />
        <StatCard
          title="Published Articles"
          value={loading ? "..." : stats.totalBlogs}
          trend="+31.0%"
          accentColor="amber"
          icon={FileText}
        />
      </div>

      {/* Row 1: Analytics Growth Chart & Topic Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnalyticsChartCard />
        </div>
        <div>
          <ContentDistributionCard />
        </div>
      </div>

      {/* Row 2: Tenant Instance Health & Master Admin Root Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TenantHealthOverviewCard />
        </div>
        <div>
          <MasterAdminToolsCard />
        </div>
      </div>

      {/* Row 3: Live Registrations Stream & Billing / Security Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <RecentActivityTable users={data?.recentUsers} loading={loading} />
        </div>
      </div>
      <div className="space-y-6">
        <PaymentOverviewCard />
        <SecurityAuditStreamCard />
      </div>
    </div>
  );
}
