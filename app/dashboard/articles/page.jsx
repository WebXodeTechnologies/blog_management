"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  PenTool,
  Search,
  Clock,
  Eye,
  Heart,
  Plus,
  Trash2,
  ExternalLink,
  Edit,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { STANDARDIZED_ARTICLES } from "@/constants/categories";
import toast from "react-hot-toast";

export default function DashboardArticlesPage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Articles state initialized with status metadata
  const [articles, setArticles] = useState(() =>
    STANDARDIZED_ARTICLES.map((art, idx) => ({
      ...art,
      // Assign initial sample statuses for demo moderation flow
      status: idx === 0 ? "APPROVED" : idx === 1 ? "PENDING" : "APPROVED",
    }))
  );

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch logged in user to evaluate role dynamically
  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  const isModerator = user?.role === "moderator";

  // Filter articles based on search & active tab
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "approved") return article.status === "APPROVED";
    if (activeTab === "pending") return article.status === "PENDING";
    if (activeTab === "suspended") return article.status === "SUSPENDED";

    return true;
  });

  // --- USER ACTIONS ---
  const handleDelete = (id, title) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success(`Deleted "${title}" successfully.`);
    }
  };

  // --- MODERATOR ACTIONS ---
  const handleApprove = (id, title) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a))
    );
    toast.success(`Approved "${title}" for public release.`);
  };

  const handleSuspend = (id, title) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "SUSPENDED" } : a))
    );
    toast.error(`Suspended "${title}" due to moderation policy.`);
  };

  return (
    <div className="pb-16 text-slate-950 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <span>Publication Workspace</span>
            </span>

            {isModerator && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-pulse">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                <span>Moderator Controls Enabled</span>
              </span>
            )}
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-950 tracking-tight">
            {isModerator ? "Articles & Moderation Queue" : "My Technical Articles"}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
            {isModerator
              ? "Inspect developer articles, review policy compliance, and execute inline approval or suspension."
              : "Manage your drafts, publish technical tutorials, and update existing articles."}
          </p>
        </div>

        {/* User Create Button (Available to User Role) */}
        {!isModerator && (
          <Link
            href="/dashboard/tech-pulse/blog/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-semibold text-xs shadow-md transition-all self-start md:self-auto cursor-pointer group"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Write New Article</span>
          </Link>
        )}
      </div>

      {/* Control Bar: Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-full sm:w-auto">
          {[
            { id: "all", label: "All Publications" },
            { id: "approved", label: "Approved" },
            { id: "pending", label: "Pending Review" },
            { id: "suspended", label: "Suspended" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-slate-950 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition"
          />
        </div>
      </div>

      {/* Articles List Grid */}
      {filteredArticles.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <PenTool className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">No articles match criteria</h3>
            <p className="text-xs text-slate-500 mt-1">
              Adjust your search filter or view another tab.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              <div>
                {/* Cover Image & Category */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                    {article.category}
                  </span>
                </div>

                {/* Article Status Pill */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" /> {article.readTime}
                  </span>

                  {article.status === "APPROVED" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Approved
                    </span>
                  )}
                  {article.status === "PENDING" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-bold text-[10px] border border-amber-200 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Pending Review
                    </span>
                  )}
                  {article.status === "SUSPENDED" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold text-[10px] border border-rose-200 flex items-center gap-1">
                      <AlertOctagon className="h-3 w-3" /> Suspended
                    </span>
                  )}
                </div>

                {/* Article Title */}
                <h3 className="font-heading font-bold text-base text-slate-950 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-slate-400" /> {article.views}
                    </span>
                    <span className="flex items-center gap-1 text-rose-500 font-medium">
                      <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> {article.likes}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                    title="View Blog Page"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>

                {/* Role Specific Action Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  {/* Both User & Moderator can Edit */}
                  <Link
                    href={`/dashboard/tech-pulse/blog/create`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    <Edit className="h-3.5 w-3.5 text-slate-500" />
                    <span>Edit</span>
                  </Link>

                  {/* USER ROLE specific action: Delete */}
                  {!isModerator && (
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  )}

                  {/* MODERATOR ROLE specific actions: Approve & Suspend */}
                  {isModerator && (
                    <>
                      {article.status !== "APPROVED" && (
                        <button
                          onClick={() => handleApprove(article.id, article.title)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {article.status !== "SUSPENDED" && (
                        <button
                          onClick={() => handleSuspend(article.id, article.title)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                        >
                          <AlertOctagon className="h-3.5 w-3.5" />
                          <span>Suspend</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
