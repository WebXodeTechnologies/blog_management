"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { STANDARDIZED_ARTICLES } from "@/constants/categories";
import toast from "react-hot-toast";

function DashboardArticlesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");

  const [articles, setArticles] = useState(() =>
    STANDARDIZED_ARTICLES.map((art, idx) => ({
      ...art,
      lifecycle:
        idx === 0
          ? "published"
          : idx === 1
            ? "drafts"
            : idx === 2
              ? "scheduled"
              : idx === 3
                ? "unlisted"
                : "submissions",
    }))
  );

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const isModerator = user?.role === "moderator";

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "all") return true;
    return article.lifecycle === activeTab;
  });

  const handleDelete = (id, title) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success(`Deleted "${title}" successfully.`);
    }
  };

  const handleApprove = (id, title) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lifecycle: "published" } : a))
    );
    toast.success(`Approved "${title}" for public release.`);
  };

  return (
    <div className="pb-16 text-slate-900 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>Stories &amp; Publications Hub</span>
            </span>

            {isModerator && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-pulse">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                <span>Moderator Actions Active</span>
              </span>
            )}
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Stories &amp; Publications Manager
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Track drafts, scheduled posts, published stories, unlisted links,
            and submissions awaiting approval.
          </p>
        </div>

        {/* Deep Indigo Action Button */}
        <Link
          href="/dashboard/tech-pulse/blog/create"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 border border-indigo-500 transition-all self-start md:self-auto cursor-pointer group"
        >
          <Plus className="h-4 w-4 stroke-3" />
          <span>Write New Story</span>
        </Link>
      </div>

      {/* Lifecycle Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-indigo-50/50 rounded-2xl border border-indigo-100 w-full sm:w-auto">
          {[
            { id: "all", label: "All Stories" },
            { id: "drafts", label: "Drafts" },
            { id: "scheduled", label: "Scheduled" },
            { id: "published", label: "Published" },
            { id: "unlisted", label: "Unlisted" },
            { id: "submissions", label: "Submissions for Approval" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs transition"
          />
        </div>
      </div>

      {/* Stories Grid */}
      {filteredArticles.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
            <PenTool className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              No stories in this tab
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select another lifecycle stage or create a new story.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between group relative hover:border-indigo-300"
            >
              <div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-indigo-50/50 border border-indigo-100">
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

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />{" "}
                    {article.readTime}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200 capitalize">
                    {article.lifecycle}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-slate-400" />{" "}
                      {article.views}
                    </span>
                    <span className="flex items-center gap-1 text-rose-500 font-medium">
                      <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />{" "}
                      {article.likes}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Link
                    href="/dashboard/tech-pulse/blog/create"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition border border-indigo-200"
                  >
                    <Edit className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition cursor-pointer border border-rose-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>

                  {isModerator && article.lifecycle === "submissions" && (
                    <button
                      onClick={() => handleApprove(article.id, article.title)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
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

export default function DashboardArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <DashboardArticlesContent />
    </Suspense>
  );
}
