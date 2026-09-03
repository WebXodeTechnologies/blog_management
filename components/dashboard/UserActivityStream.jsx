"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  ExternalLink,
  Edit,
  Calendar,
  Vote,
  BarChart3,
  Loader2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

export default function UserActivityStream() {
  const [activeTab, setActiveTab] = useState("drafts");
  const [drafts, setDrafts] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(true);

  // Clean initial states without hardcoded mock numbers
  const [pollOptions, setPollOptions] = useState([]);
  const [pollQuestion, setPollQuestion] = useState("Loading active poll...");
  const [votedId, setVotedId] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Fetch drafts and scheduled posts
  useEffect(() => {
    fetch("/api/v1/user/activity")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDrafts(data.drafts || []);
          setScheduled(data.scheduled || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch active fan poll data from MongoDB
  useEffect(() => {
    fetch("/api/v1/user/poll")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.poll) {
          setPollOptions(data.poll.options || []);
          if (data.poll.question) setPollQuestion(data.poll.question);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch true database analytics for weekly chart traffic
  useEffect(() => {
    fetch("/api/v1/user/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.chart) {
          setChartData(data.chart);
        }
      })
      .catch(() => {})
      .finally(() => setChartLoading(false));
  }, []);

  // Unified production vote handler with backend synchronization
  const handleVote = async (id) => {
    if (votedId) return;
    setVotedId(id);
    setPollOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
      )
    );

    try {
      await fetch("/api/v1/user/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: id }),
      });
      toast.success("Vote recorded in live fan poll!");
    } catch {
      toast.error("Failed to sync vote with server");
    }
  };

  const totalPollVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Left Column: Recent Drafts & Scheduled Posts Stream */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Activity Stream &amp; Publications
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track your active writing drafts, scheduled posts, and reader
                interactions.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => setActiveTab("drafts")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === "drafts"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Recent Posts ({drafts.length})
              </button>
              <button
                onClick={() => setActiveTab("scheduled")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === "scheduled"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Scheduled ({scheduled.length})
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "drafts" && (
              <motion.div
                key="drafts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {drafts.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No recent posts found in your workspace.
                  </div>
                ) : (
                  drafts.map((article) => (
                    <div
                      key={article._id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-2xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-4">
                        {article.coverImage && (
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            <Image
                              src={article.coverImage}
                              alt={article.title}
                              fill
                              sizes="80px"
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {article.category || "Architecture"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />{" "}
                              {article.readTime || "5 min read"}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {article.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {article.excerpt || "No excerpt provided..."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition border border-slate-200"
                          title="Preview Article"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          href="/dashboard/write"
                          className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-2xs"
                          title="Edit Draft"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
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
                {scheduled.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No scheduled publications right now.
                  </div>
                ) : (
                  scheduled.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                          <span className="font-semibold text-indigo-600">
                            {item.scheduledDate || "Upcoming release"}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-sm text-slate-900">
                          {item.title}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200 shrink-0">
                        {item.category || "General"}
                      </span>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Real-Time Charts & Fan Poll Widget */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
                <span>Real-Time Traffic &amp; Reads</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Weekly views vs full reads
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live DB
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/80 space-y-4">
            {chartLoading ? (
              <div className="h-32 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-xs text-slate-400">
                No traffic metrics available
              </div>
            ) : (
              <div className="h-32 flex items-end justify-between gap-2 pt-4">
                {chartData.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                  >
                    <div
                      className="w-full bg-indigo-200 group-hover:bg-indigo-600 rounded-t-lg transition-all relative flex items-end justify-center"
                      style={{ height: `${d.height || 20}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap z-10">
                        {d.views} views ({d.reads} reads)
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fan Poll Widget */}
        {/* <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4 text-amber-500" />
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Active Fan Poll
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {totalPollVotes} votes
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-800">{pollQuestion}</p>

          <div className="space-y-2.5">
            {pollOptions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                Loading poll options...
              </div>
            ) : (
              pollOptions.map((opt) => {
                const percentage =
                  totalPollVotes > 0
                    ? Math.round((opt.votes / totalPollVotes) * 100)
                    : 0;
                const isSelected = votedId === opt.id;
                return (
                  <button
                    key={opt._id || opt.id}
                    onClick={() => handleVote(opt.id)}
                    disabled={votedId !== null}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition relative overflow-hidden ${
                      votedId !== null ? "cursor-default" : "cursor-pointer"
                    } ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold"
                        : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-indigo-100/60 rounded-2xl pointer-events-none transition-all duration-500"
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
              })
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
