"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  TrendingUp,
  HardDrive,
  Globe,
  Award,
  ArrowUpRight,
  Eye,
  Database,
  Loader2,
  FileSpreadsheet,
  Clock,
} from "lucide-react";

export default function UserAdvancedInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/user/insights")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInsights(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Safe fallback metrics structure if API data is pending or empty
  const metrics = insights || {
    shares: [
      { id: 1, platform: "X (Twitter)", mentions: 0, growth: "0%", url: "#" },
      { id: 2, platform: "LinkedIn", mentions: 0, growth: "0%", url: "#" },
      { id: 3, platform: "Hacker News", mentions: 0, growth: "0%", url: "#" },
    ],
    leaderboard: [],
    storage: {
      usedMB: 0,
      totalMB: 2048,
      mediaFiles: 0,
      databaseCollections: 4,
    },
  };

  const storagePercentage = Math.round(
    (metrics.storage.usedMB / metrics.storage.totalMB) * 100
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
      {/* 1. Social Share & Mention Tracker */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-indigo-600" />
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Social Mentions &amp; Shares
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 pt-4">
            {metrics.shares.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/70 flex items-center justify-between text-xs transition hover:border-indigo-300"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {item.platform}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {item.mentions} total references
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 block">
                    {item.growth}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    vs last week
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
          Tracked across developer networks &amp; social platforms.
        </p>
      </div>

      {/* 2. Top-Performing Articles Leaderboard */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Top Content Leaderboard
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Last 30 Days
            </span>
          </div>

          <div className="space-y-3 pt-4">
            {metrics.leaderboard.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No published articles found for leaderboard ranking.
              </div>
            ) : (
              metrics.leaderboard.map((article, index) => (
                <div
                  key={article.id}
                  className="p-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100 text-[10px]">
                      0{index + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-slate-900 line-clamp-1">
                        {article.title}
                      </h5>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-bold text-slate-900 flex items-center gap-1 justify-end">
                      <Eye className="h-3 w-3 text-slate-400" /> {article.views}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
          Ranked by full reader engagement and total unique views.
        </p>
      </div>

      {/* 3. Media & Storage Usage */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-indigo-600" />
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Media &amp; Storage Meters
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {storagePercentage}% Used
            </span>
          </div>

          <div className="space-y-4 pt-4">
            {/* Storage Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Cloudinary &amp; UploadThing</span>
                <span className="font-mono">
                  {metrics.storage.usedMB} MB / {metrics.storage.totalMB} MB
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
            </div>

            {/* Asset Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50/60 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Media Assets</span>
                </div>
                <p className="text-sm font-bold font-mono text-slate-900">
                  {metrics.storage.mediaFiles} files
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/60 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <Database className="h-3.5 w-3.5 text-indigo-600" />
                  <span>DB Collections</span>
                </div>
                <p className="text-sm font-bold font-mono text-slate-900">
                  {metrics.storage.databaseCollections} tables
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Cloud cluster synced</span>
          <span className="font-semibold text-emerald-600 flex items-center gap-1">
            Healthy{" "}
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </span>
        </div>
      </div>
    </div>
  );
}
