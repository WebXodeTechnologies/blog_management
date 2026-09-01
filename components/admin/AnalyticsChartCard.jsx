"use client";

import { useState } from "react";
import { TrendingUp, BarChart3, Calendar, Download } from "lucide-react";

export default function AnalyticsChartCard() {
  const [activeTab, setActiveTab] = useState("revenue"); // "revenue" | "users" | "blogs"

  const metricsData = {
    revenue: {
      label: "Monthly Recurring Revenue (MRR)",
      current: "$14,850",
      growth: "+24.5%",
      unit: "$",
      points: [4200, 5100, 6800, 7400, 8900, 9600, 11200, 12400, 13100, 13900, 14200, 14850],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      barColor: "bg-indigo-600",
      gradientFrom: "from-indigo-600",
      gradientTo: "to-violet-500",
    },
    users: {
      label: "Platform Active Readers & Authors",
      current: "8,920",
      growth: "+18.2%",
      unit: "",
      points: [1200, 1800, 2400, 3100, 4200, 4900, 5800, 6400, 7200, 7900, 8400, 8920],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      barColor: "bg-emerald-600",
      gradientFrom: "from-emerald-600",
      gradientTo: "to-teal-500",
    },
    blogs: {
      label: "Published Technical Articles",
      current: "1,450",
      growth: "+31.0%",
      unit: "",
      points: [120, 210, 340, 450, 580, 720, 890, 1020, 1150, 1280, 1360, 1450],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      barColor: "bg-amber-500",
      gradientFrom: "from-amber-500",
      gradientTo: "to-orange-500",
    },
  };

  const currentMetric = metricsData[activeTab];
  const maxPoint = Math.max(...currentMetric.points);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs font-sans space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-950">
              Platform Growth Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time performance metrics tracking revenue, user acquisition, and content velocity.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => setActiveTab("revenue")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "revenue"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            MRR Revenue
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "users"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            User Growth
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "blogs"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Articles
          </button>
        </div>
      </div>

      {/* Metric Highlight Bar */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {currentMetric.label}
          </span>
          <div className="text-3xl font-black text-slate-950 tracking-tight mt-0.5">
            {currentMetric.current}
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{currentMetric.growth} YoY</span>
        </div>
      </div>

      {/* Corporate Visual SVG/HTML Bar & Area Chart */}
      <div className="pt-2 space-y-3">
        <div className="h-48 flex items-end gap-2 sm:gap-3 justify-between border-b border-slate-100 pb-2 px-1">
          {currentMetric.points.map((val, idx) => {
            const heightPercent = Math.round((val / maxPoint) * 100);
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative"
              >
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 bg-slate-950 text-white text-[10px] font-bold py-1 px-2 rounded-lg shadow-lg pointer-events-none z-10 whitespace-nowrap">
                  {currentMetric.months[idx]}: {currentMetric.unit}{val.toLocaleString()}
                </div>

                {/* Animated Column Bar */}
                <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full bg-linear-to-t ${currentMetric.gradientFrom} ${currentMetric.gradientTo} rounded-t-lg transition-all duration-500 group-hover:brightness-110 shadow-xs`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Month Labels */}
        <div className="flex justify-between text-[11px] font-mono font-semibold text-slate-400 px-1">
          {currentMetric.months.map((m) => (
            <span key={m} className="flex-1 text-center">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
