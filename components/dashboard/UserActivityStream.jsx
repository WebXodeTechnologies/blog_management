"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  Calendar,
  Edit,
  ExternalLink,
  Vote,
  CheckCircle2,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { STANDARDIZED_ARTICLES } from "@/constants/categories";
import toast from "react-hot-toast";

export default function UserActivityStream() {
  const [activeTab, setActiveTab] = useState("drafts");

  // Fan Poll interactive state
  const [pollOptions, setPollOptions] = useState([
    { id: 1, label: "Next.js App Router & Server Components", votes: 420 },
    { id: 2, label: "Rust & Distributed Systems", votes: 280 },
    { id: 3, label: "Web3 Smart Contracts & Security", votes: 142 },
  ]);
  const [votedId, setVotedId] = useState(null);

  const handleVote = (id) => {
    if (votedId) return;
    setVotedId(id);
    setPollOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt))
    );
    toast.success("Vote recorded in live fan poll!");
  };

  const totalPollVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);

  const sampleDrafts = STANDARDIZED_ARTICLES.slice(0, 3);
  const sampleScheduled = [
    {
      id: "SCH-01",
      title: "Building Real-Time Chat with Socket.io & Redis Pub/Sub",
      scheduledDate: "Tomorrow at 10:00 AM",
      category: "Realtime Systems",
      readTime: "8 min read",
    },
    {
      id: "SCH-02",
      title: "Optimizing MongoDB Atlas Aggregation Pipelines",
      scheduledDate: "Sep 5, 2026 at 2:30 PM",
      category: "Database",
      readTime: "12 min read",
    },
  ];

  // SVG Chart data points for 7 days engagement (Views & Reads)
  const chartData = [
    { day: "Mon", views: 2400, reads: 1800, height: 60 },
    { day: "Tue", views: 3800, reads: 2600, height: 85 },
    { day: "Wed", views: 3100, reads: 2100, height: 70 },
    { day: "Thu", views: 4900, reads: 3400, height: 95 },
    { day: "Fri", views: 4200, reads: 3100, height: 88 },
    { day: "Sat", views: 2900, reads: 2000, height: 65 },
    { day: "Sun", views: 5400, reads: 4100, height: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Left Column: Recent Drafts & Scheduled Posts Stream */}
      <div className="lg:col-span-8 space-y-6">
        {/* Stream Header & Tab Bar */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">
                Activity Stream &amp; Publications
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track your active writing drafts, scheduled posts, and reader interactions.
              </p>
            </div>

            {/* Stream Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-2xl border border-border">
              <button
                onClick={() => setActiveTab("drafts")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === "drafts"
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Recent Posts ({sampleDrafts.length})
              </button>
              <button
                onClick={() => setActiveTab("scheduled")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === "scheduled"
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Scheduled ({sampleScheduled.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "drafts" && (
              <motion.div
                key="drafts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {sampleDrafts.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 sm:p-5 rounded-2xl bg-background border border-border/80 hover:border-primary/40 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-muted border border-border">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                            {article.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {article.readTime}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-hover transition border border-border"
                        title="Preview Article"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <Link
                        href="/dashboard/tech-pulse/blog/create"
                        className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition shadow-2xs"
                        title="Edit Draft"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "scheduled" && (
              <motion.div
                key="scheduled"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {sampleScheduled.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-background border border-border flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span className="font-semibold text-primary">
                          {item.scheduledDate}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-foreground">
                        {item.title}
                      </h4>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-muted text-muted-foreground text-[10px] font-semibold border border-border shrink-0">
                      {item.category}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Real-Time Charts & Fan Poll Widget */}
      <div className="lg:col-span-4 space-y-6">
        {/* Real-time SVG Engagement Chart */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>Real-Time Traffic &amp; Reads</span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Weekly views vs full reads
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              +24% growth
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border/80 space-y-4">
            <div className="h-32 flex items-end justify-between gap-2 pt-4">
              {chartData.map((d, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div
                    className="w-full bg-primary/25 group-hover:bg-primary rounded-t-lg transition-all relative flex items-end justify-center"
                    style={{ height: `${d.height}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap z-10">
                      {d.views} views ({d.reads} reads)
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fan Poll Widget */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4 text-amber-500" />
              <h4 className="font-heading font-bold text-sm text-foreground">
                Active Fan Poll
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
              {totalPollVotes} votes
            </span>
          </div>

          <p className="text-xs font-semibold text-foreground">
            What technical topic should Texora highlight next week?
          </p>

          <div className="space-y-2.5">
            {pollOptions.map((opt) => {
              const percentage = Math.round((opt.votes / totalPollVotes) * 100);
              const isSelected = votedId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs transition relative overflow-hidden cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary font-bold"
                      : "bg-background border-border text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {/* Fill meter */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-primary/10 rounded-2xl pointer-events-none transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="truncate pr-2">{opt.label}</span>
                    <span className="font-mono text-[11px] font-bold shrink-0">
                      {percentage}% ({opt.votes})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
