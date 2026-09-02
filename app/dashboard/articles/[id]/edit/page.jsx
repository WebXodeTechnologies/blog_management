"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

import CoverImageUploader from "@/components/editor/CoverImageUploader";
import TitleSection from "@/components/editor/TitleSection";
import TiptapEditor from "@/components/editor/TiptapEditor";
import EditorSidebarSettings from "@/components/editor/EditorSidebarSettings";

const CATEGORIES = [
  "Architecture",
  "AI & Machine Learning",
  "Web3 & Blockchain",
  "DevOps & Cloud",
  "Cybersecurity",
  "Frontend Engineering",
  "Backend & APIs",
];

function EditDashboardArticleContent({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Editor states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Architecture");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState("draft");
  const [editorContent, setEditorContent] = useState("");

  // Fetch logged in user
  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Helper for tenant slug
  const getActiveTenantSlug = () => {
    if (typeof window === "undefined") return "general";
    try {
      return (
        localStorage.getItem("activeTenantSlug") ||
        user?.activeTenantSlug ||
        "general"
      );
    } catch {
      return "general";
    }
  };

  // Fetch existing article
  useEffect(() => {
    const tenantSlug = getActiveTenantSlug();
    fetch(`/api/v1/blogs/${id}?tenantSlug=${tenantSlug}`, {
      headers: { "x-tenant-slug": tenantSlug },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blog) {
          const b = data.blog;
          setTitle(b.title || "");
          setSubtitle(b.excerpt || "");
          setCoverImage(b.coverImage || "");
          setCategory(b.category || "Architecture");
          setTags(b.tags || []);
          setStatus(b.status || "draft");
          if (b.content) {
            setEditorContent(b.content);
          }
        } else {
          toast.error(data.message || "Failed to load article details");
        }
      })
      .catch(() => toast.error("Error fetching article for editing"))
      .finally(() => setLoading(false));
  }, [id]);

  // Word count & read time calculations
  const plainText = (
    title +
    " " +
    subtitle +
    " " +
    editorContent.replace(/<[^>]*>/g, " ")
  )
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const wordCount = plainText.length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  // Tag Handlers
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, "").toLowerCase();
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Handle Update Submission with Credentials Included
  const handleUpdateStory = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title for your story");
      return;
    }

    setSubmitting(true);
    const tenantSlug = getActiveTenantSlug();

    try {
      const res = await fetch(`/api/v1/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-slug": tenantSlug,
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          excerpt: subtitle,
          content: editorContent,
          category,
          tags,
          coverImage,
          status,
          tenantSlug,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update story");
      }

      toast.success("Blog submitted successfully!");
      router.push("/dashboard/articles");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to update story");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 font-sans pb-24 select-none">
      {/* Top Fixed Control Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
        <Link
          href="/dashboard/articles"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Articles Manager
        </Link>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="unlisted">Unlisted</option>
            <option value="submissions">Submission for Approval</option>
          </select>

          <button
            onClick={handleUpdateStory}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </header>

      {/* Main Container Aligned to max-w-7xl mx-auto */}
      <main className="max-w-7xl mx-auto pt-6 sm:pt-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Writing Canvas (Left Column - 8/12) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            <CoverImageUploader
              coverImage={coverImage}
              onSetCoverImage={setCoverImage}
            />

            <TitleSection
              title={title}
              subtitle={subtitle}
              onTitleChange={setTitle}
              onSubtitleChange={setSubtitle}
            />

            <TiptapEditor
              content={editorContent}
              onChange={(html) => setEditorContent(html)}
            />
          </div>

          {/* Publishing & Settings Sidebar (Right Column - 4/12) */}
          <div className="lg:col-span-4 sticky top-20">
            <EditorSidebarSettings
              user={user}
              title={title}
              subtitle={subtitle}
              category={category}
              categories={CATEGORIES}
              tags={tags}
              tagInput={tagInput}
              readTimeMin={readTimeMin}
              wordCount={wordCount}
              onCategoryChange={setCategory}
              onTagInputChange={setTagInput}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EditDashboardArticlePage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <EditDashboardArticleContent params={params} />
    </Suspense>
  );
}
