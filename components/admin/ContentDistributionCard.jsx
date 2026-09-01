"use client";

import { PieChart, Tags, Sparkles } from "lucide-react";

export default function ContentDistributionCard() {
  const topics = [
    { name: "AI & Machine Learning", count: 420, percentage: 32, color: "bg-indigo-600", textColor: "text-indigo-600" },
    { name: "Web Development & Next.js", count: 350, percentage: 26, color: "bg-emerald-600", textColor: "text-emerald-600" },
    { name: "System Design & Architecture", count: 280, percentage: 21, color: "bg-purple-600", textColor: "text-purple-600" },
    { name: "DevOps & Cloud Native", count: 180, percentage: 14, color: "bg-amber-500", textColor: "text-amber-600" },
    { name: "Cybersecurity & Data", count: 95, percentage: 7, color: "bg-rose-500", textColor: "text-rose-600" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs font-sans space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            Article Topics & Category Distribution
          </h2>
          <p className="text-xs text-slate-500">Publication breakdown by technical domain</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          5 Topics
        </span>
      </div>

      {/* Progress Bars Stack */}
      <div className="space-y-4 pt-1">
        {topics.map((t) => (
          <div key={t.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-900 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                {t.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono font-normal">{t.count} posts</span>
                <span className={`font-extrabold font-mono ${t.textColor}`}>{t.percentage}%</span>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                style={{ width: `${t.percentage}%` }}
                className={`h-full rounded-full ${t.color} transition-all duration-500 shadow-xs`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
