"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Users,
  FileText,
  Globe,
} from "lucide-react";

export default function AnalyticsPage() {
  const [analytics] = useState({
    totalViews: "128,450",
    totalLikes: "14,892",
    subscribers: "4,320",
    publishedArticles: 38,
  });

  return (
    <div className="pb-16 text-slate-900 font-sans space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
            <span>Platform Metrics</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Analytics Hub
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Real-time telemetry, reader traffic, publication engagement, and
            content performance metrics.
          </p>
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Total Read Impressions",
            value: analytics.totalViews,
            change: "+18.4%",
            icon: <Eye className="h-5 w-5 text-indigo-600" />,
          },
          {
            label: "Reader Reactions & Likes",
            value: analytics.totalLikes,
            change: "+24.1%",
            icon: <Heart className="h-5 w-5 text-rose-500" />,
          },
          {
            label: "Subscribed Engineers",
            value: analytics.subscribers,
            change: "+12.5%",
            icon: <Users className="h-5 w-5 text-indigo-600" />,
          },
          {
            label: "Published Stories",
            value: analytics.publishedArticles,
            change: "+4 new",
            icon: <FileText className="h-5 w-5 text-amber-500" />,
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {kpi.label}
              </span>
              <div className="p-2.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                {kpi.icon}
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
                {kpi.value}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <TrendingUp className="h-3 w-3" />
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Telemetry Visual Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Traffic &amp; Engagement Stream
            </h3>
            <p className="text-xs text-slate-500">
              Weekly workspace telemetry &amp; readership activity breakdown.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Globe className="h-3.5 w-3.5" />
            Live Sync
          </span>
        </div>

        <div className="h-64 rounded-2xl bg-linear-to-b from-indigo-50/40 to-white border border-indigo-100/60 flex items-center justify-center p-6 text-center">
          <div className="space-y-2">
            <BarChart3 className="h-10 w-10 text-indigo-500 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-slate-900">
              Telemetry Stream Active
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Real-time reader events and workspace activity metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
