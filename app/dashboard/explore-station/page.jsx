"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Bookmark,
  Highlighter,
  History,
  MessageSquare,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { STANDARDIZED_ARTICLES } from "@/constants/categories";

function ExploreStationContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "your-list";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [highlights] = useState([
    {
      id: "HL-1",
      articleTitle: "Microservices Architecture in 2026",
      quote:
        "Single-tenant databases reduce noisy neighbor latency spikes by 40% under spike load.",
      note: "Important takeaway for our Texora database schema optimization.",
      date: "Yesterday",
    },
    {
      id: "HL-2",
      articleTitle: "Building Asynchronous Event Loops in Rust",
      quote:
        "Lock-free MPMC channels prevent thread contention during peak throughput.",
      note: "Benchmark test candidate for our socket worker infrastructure.",
      date: "3 days ago",
    },
  ]);

  const [responses] = useState([
    {
      id: "RES-1",
      articleTitle: "Optimizing MongoDB Atlas Aggregation Pipelines",
      author: "Alex Rivera",
      comment:
        "Great breakdown of compound index ordering! Made a 3x speedup in our user query latency.",
      date: "2 hours ago",
    },
  ]);

  return (
    <div className="pb-16 text-slate-900 font-sans space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Curated Reading Hub</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Explore Station
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Access your curated lists, saved reading history, key article
            highlights, and community responses.
          </p>
        </div>
      </div>

      {/* Tab Navigation Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/80 scrollbar-none">
        {[
          {
            id: "your-list",
            label: "Your List",
            icon: <BookOpen className="h-4 w-4" />,
          },
          {
            id: "saved",
            label: "Saved List",
            href: "/bookmarks",
            icon: <Bookmark className="h-4 w-4" />,
          },
          {
            id: "highlights",
            label: "Highlights",
            icon: <Highlighter className="h-4 w-4" />,
          },
          {
            id: "history",
            label: "Reading History",
            icon: <History className="h-4 w-4" />,
          },
          {
            id: "responses",
            label: "Responses",
            icon: <MessageSquare className="h-4 w-4" />,
          },
        ].map((tab) => {
          if (tab.href) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 transition shrink-0"
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            );
          }
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                isActive
                  ? "bg-indigo-600 text-white font-bold shadow-xs border border-indigo-500"
                  : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === "your-list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STANDARDIZED_ARTICLES.slice(0, 3).map((article) => (
            <div
              key={article.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex flex-col justify-between group hover:border-indigo-300 transition"
            >
              <div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-indigo-50/50">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-700/90 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                    {article.category}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  {article.readTime}
                </span>
                <Link
                  href={`/articles/${article.slug}`}
                  className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "highlights" && (
        <div className="space-y-4 max-w-4xl">
          {highlights.map((hl) => (
            <div
              key={hl.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-600">
                  {hl.articleTitle}
                </span>
                <span>{hl.date}</span>
              </div>
              <blockquote className="p-4 rounded-2xl bg-amber-50 border-l-4 border-amber-400 text-slate-800 text-xs italic leading-relaxed">
                &ldquo;{hl.quote}&rdquo;
              </blockquote>
              <p className="text-xs text-slate-600">
                <strong className="text-slate-900">Note:</strong> {hl.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-3 max-w-3xl">
          {STANDARDIZED_ARTICLES.slice(0, 4).map((art, idx) => (
            <div
              key={art.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-4 text-xs shadow-2xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold">
                  Read {idx === 0 ? "20 mins ago" : `${idx + 1} hours ago`}
                </span>
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  {art.title}
                </h4>
              </div>
              <Link
                href={`/articles/${art.slug}`}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition border border-indigo-200"
              >
                Revisit
              </Link>
            </div>
          ))}
        </div>
      )}

      {activeTab === "responses" && (
        <div className="space-y-4 max-w-3xl">
          {responses.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 space-y-2 text-xs shadow-2xs"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold text-slate-900">
                  {res.author}
                </span>
                <span>{res.date}</span>
              </div>
              <p className="text-slate-700 font-medium">{res.comment}</p>
              <p className="text-[11px] text-indigo-600 font-semibold pt-1">
                On: {res.articleTitle}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExploreStationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ExploreStationContent />
    </Suspense>
  );
}
