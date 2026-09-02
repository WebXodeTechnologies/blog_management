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
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

function getActiveTenantSlug() {
  if (typeof window === "undefined") return "general";
  try {
    return localStorage.getItem("activeTenantSlug") || "general";
  } catch {
    return "general";
  }
}

function DashboardArticlesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";

  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete Modal State Management
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const tenantSlug = getActiveTenantSlug();
      const res = await fetch(`/api/v1/blogs?tenantSlug=${tenantSlug}`, {
        headers: { "x-tenant-slug": tenantSlug },
      });
      const data = await res.json();
      if (data.success) {
        setArticles(
          data.blogs.map((b) => ({
            ...b,
            id: b._id,
            image:
              b.coverImage ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
            readTime: `${Math.max(1, Math.ceil((b.content?.length || 100) / 1000))} min read`,
            likes: b.likes || 0,
            lifecycle: b.status || "draft",
          }))
        );
      } else {
        toast.error(data.message || "Failed to load articles");
      }
    } catch (err) {
      toast.error("Error connecting to database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const isModerator = user?.role === "moderator";

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "all") return true;
    return article.lifecycle === activeTab;
  });

  const confirmDeleteClick = (article) => {
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);

    try {
      const tenantSlug = getActiveTenantSlug();
      const res = await fetch(
        `/api/v1/blogs/${articleToDelete.id}?tenantSlug=${tenantSlug}`,
        {
          method: "DELETE",
          headers: { "x-tenant-slug": tenantSlug },
        }
      );
      const data = await res.json();

      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
        toast.success(`Deleted "${articleToDelete.title}" successfully.`);
        setDeleteModalOpen(false);
        setArticleToDelete(null);
      } else {
        toast.error(data.message || "Failed to delete article");
      }
    } catch (err) {
      toast.error("Error deleting article");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprove = async (id, title) => {
    try {
      const tenantSlug = getActiveTenantSlug();
      const res = await fetch(`/api/v1/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-slug": tenantSlug,
        },
        body: JSON.stringify({ status: "published", tenantSlug }),
      });
      const data = await res.json();

      if (data.success) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, lifecycle: "published" } : a))
        );
        toast.success(`Approved "${title}" for public release.`);
      } else {
        toast.error(data.message || "Failed to approve article");
      }
    } catch (err) {
      toast.error("Error approving article");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-slate-900 font-sans relative overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200/85">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>Stories &amp; Publications Hub</span>
            </span>

            {isModerator && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-pulse">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span>Moderator Actions Active</span>
              </span>
            )}
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            Stories &amp; Publications Manager
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Track drafts, scheduled posts, published stories, unlisted links,
            and submissions awaiting approval.
          </p>
        </div>

        <Link
          href="/dashboard/write"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 border border-indigo-500 transition-all w-full md:w-auto cursor-pointer group shrink-0"
        >
          <Plus className="h-4 w-4 stroke-3" />
          <span>Write New Story</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Control (Search hidden below 2k screens) */}
      <div className="flex flex-col 2xl:flex-row items-stretch 2xl:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1.5 p-1.5 bg-indigo-50/50 rounded-2xl border border-indigo-100 overflow-x-auto scrollbar-none w-full 2xl:w-auto">
          {[
            { id: "all", label: "All Stories" },
            { id: "draft", label: "Drafts" },
            { id: "scheduled", label: "Scheduled" },
            { id: "published", label: "Published" },
            { id: "unlisted", label: "Unlisted" },
            { id: "submissions", label: "Submissions for Approval" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search bar visible only on ultra-wide / 2k+ screens */}
        <div className="hidden 2xl:block relative w-72 shrink-0">
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

      {/* Grid Content: 2-column layout on standard laptops for larger, immersive cards */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
            <PenTool className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              No stories found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select another lifecycle stage or create a new story.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative hover:border-indigo-300"
            >
              <div>
                <Link href={`/dashboard/articles/${article.id}`}>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-5 bg-indigo-50/50 border border-indigo-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3.5 left-3.5 px-3.5 py-1 rounded-full bg-indigo-700/90 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow-xs">
                      {article.category || "Architecture"}
                    </span>
                  </div>
                </Link>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-4 w-4 text-indigo-500 shrink-0" />{" "}
                    {article.readTime}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200 capitalize">
                    {article.lifecycle}
                  </span>
                </div>

                <Link href={`/dashboard/articles/${article.id}`}>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed">
                  {article.excerpt ||
                    article.subtitle ||
                    "No excerpt provided..."}
                </p>
              </div>

              <div className="pt-5 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60">
                      <Eye className="h-4 w-4 text-slate-400 shrink-0" />{" "}
                      {article.views || 0} views
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-600 font-semibold bg-rose-50/60 px-2.5 py-1 rounded-xl border border-rose-100">
                      <Heart className="h-4 w-4 fill-rose-500 text-rose-500 shrink-0" />{" "}
                      {article.likes} likes
                    </span>
                  </div>

                  {article.slug && (
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition shrink-0 border border-slate-200/60 bg-slate-50"
                      title="View Live Public Page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
                  <Link
                    href={`/dashboard/articles/${article.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition border border-indigo-200"
                  >
                    <Edit className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Edit Article</span>
                  </Link>

                  <button
                    onClick={() => confirmDeleteClick(article)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition cursor-pointer border border-rose-200"
                  >
                    <Trash2 className="h-4 w-4 shrink-0" />
                    <span>Delete</span>
                  </button>

                  {isModerator && article.lifecycle === "submissions" && (
                    <button
                      onClick={() => handleApprove(article.id, article.title)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center relative space-y-4">
            <button
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Delete Story
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">
                  &ldquo;{articleToDelete?.title}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={isDeleting}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting && (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                )}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
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
