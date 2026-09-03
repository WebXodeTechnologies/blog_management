"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  trend,
  trendText = "vs last month",
  icon: Icon,
  badge,
  accentColor = "indigo",
}) {
  const isPositive = trend && !trend.startsWith("-");

  const colorStyles =
    {
      indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
      emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
      amber: "bg-amber-50 border-amber-100 text-amber-600",
      purple: "bg-purple-50 border-purple-100 text-purple-600",
      rose: "bg-rose-50 border-rose-100 text-rose-600",
      blue: "bg-blue-50 border-blue-100 text-blue-600",
    }[accentColor] || "bg-indigo-50 border-indigo-100 text-indigo-600";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all font-sans space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-sans font-semibold tracking-wider text-slate-900">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorStyles}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-slate-950 tracking-tight">
            {value}
          </div>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {badge}
            </span>
          )}
        </div>

        {trend && (
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span
              className={
                isPositive
                  ? "text-emerald-600 font-bold"
                  : "text-rose-600 font-bold"
              }
            >
              {trend}
            </span>{" "}
            <span>{trendText}</span>
          </p>
        )}
      </div>
    </div>
  );
}
