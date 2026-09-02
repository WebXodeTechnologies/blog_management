"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import EditorHeader from "@/components/editor/EditorHeader";
import CoverImageUploader from "@/components/editor/CoverImageUploader";
import TitleSection from "@/components/editor/TitleSection";
import TiptapEditor from "@/components/editor/TiptapEditor";
import EditorSidebarSettings from "@/components/editor/EditorSidebarSettings";
import ProfileCompletionModal from "@/components/editor/ProfileCompletionModal";
import PublishModal from "@/components/editor/PublishModal";

const CATEGORIES = [
  "Architecture",
  "AI & Machine Learning",
  "Web3 & Blockchain",
  "DevOps & Cloud",
  "Cybersecurity",
  "Frontend Engineering",
  "Backend & APIs",
];

function WriteBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Profile completion check state
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Editor content state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Architecture");
  const [tags, setTags] = useState(["nextjs", "react", "architecture"]);
  const [tagInput, setTagInput] = useState("");

  // TipTap Rich HTML Content
  const [editorContent, setEditorContent] = useState(
    "<h3>Building Scalable Technical Applications</h3><p>Start writing your technical story here...</p>"
  );

  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState("Just now");

  // Fetch logged in user & enforce mandatory profile completion
  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          const isIncomplete =
            !data.user.name || !data.user.bio || !data.user.avatar;
          if (isIncomplete) {
            setShowProfileModal(true);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  // Fetch existing article data if editing ID is provided in search params
  useEffect(() => {
    if (blogId) {
      setIsEditing(true);
      fetch(`/api/v1/blogs/${blogId}?tenantSlug=general`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.blog) {
            const b = data.blog;
            setTitle(b.title || "");
            setSubtitle(b.excerpt || "");
            setCoverImage(b.coverImage || "");
            setCategory(b.category || "Architecture");
            setTags(b.tags || ["nextjs", "react", "architecture"]);
            if (b.content) {
              setEditorContent(b.content);
            }
          } else {
            toast.error("Failed to load article details");
          }
        })
        .catch(() => toast.error("Error fetching article for editing"));
    }
  }, [blogId]);

  // Helper to extract or fallback tenant slug
  const getActiveTenantSlug = () => {
    if (typeof window === "undefined") return "general";
    const pathSegments = window.location.pathname.split("/");
    const tenantIndex = pathSegments.indexOf("tenant");
    if (tenantIndex !== -1 && pathSegments[tenantIndex + 1]) {
      return pathSegments[tenantIndex + 1];
    }
    return user?.activeTenantSlug || "general";
  };

  // Plain text stripping for word count & reading time
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

  // Unified save or update request helper
  const saveOrUpdateBlog = async (targetStatus) => {
    const endpoint = isEditing ? `/api/v1/blogs/${blogId}` : "/api/v1/blogs";
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      title,
      excerpt: subtitle,
      content: editorContent,
      category,
      tags,
      coverImage,
      status: targetStatus,
      tenantSlug: getActiveTenantSlug(),
    };

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to save story");
    }
    return data.blog;
  };

  // Save Draft API Call
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title to save your draft");
      return;
    }

    setSavingDraft(true);
    try {
      await saveOrUpdateBlog("draft");

      setLastSavedTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      toast.success("Draft saved successfully to workspace!");
    } catch (err) {
      toast.error(err.message || "Failed to save draft");
    } finally {
      setSavingDraft(false);
    }
  };

  // Publish Story API Call
  const handlePublishStory = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your story");
      return;
    }

    if (!user?.name || !user?.bio || !user?.avatar) {
      setShowProfileModal(true);
      toast.error("Please complete your profile details before publishing");
      return;
    }

    setPublishing(true);
    try {
      await saveOrUpdateBlog("published");

      toast.success("Congratulations! Your story has been published!");
      setShowPublishModal(false);
      router.push("/dashboard/articles");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to publish story");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 font-sans pb-24 select-none">
      {/* Top Fixed Control Header */}
      <EditorHeader
        title={title}
        userRole={user?.role}
        lastSavedTime={lastSavedTime}
        readTimeMin={readTimeMin}
        wordCount={wordCount}
        savingDraft={savingDraft}
        onSaveDraft={handleSaveDraft}
        onOpenPublish={() => setShowPublishModal(true)}
      />

      {/* Main Container Aligned to max-w-7xl mx-auto */}
      <main className="max-w-7xl mx-auto pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Writing Canvas (Left Column - 8/12) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            {/* Cover Banner Uploader */}
            <CoverImageUploader
              coverImage={coverImage}
              onSetCoverImage={setCoverImage}
            />

            {/* Title & Subtitle Section */}
            <TitleSection
              title={title}
              subtitle={subtitle}
              onTitleChange={setTitle}
              onSubtitleChange={setSubtitle}
            />

            {/* TipTap Rich Text Editor */}
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

      {/* Mandatory Profile Setup Requirement Modal */}
      <ProfileCompletionModal show={showProfileModal} user={user} />

      {/* Story Publish Confirmation Drawer Modal */}
      <PublishModal
        show={showPublishModal}
        title={title}
        subtitle={subtitle}
        content={editorContent.replace(/<[^>]*>/g, " ")}
        category={category}
        readTimeMin={readTimeMin}
        wordCount={wordCount}
        publishing={publishing}
        onClose={() => setShowPublishModal(false)}
        onConfirmPublish={handlePublishStory}
      />
    </div>
  );
}

export default function WriteBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <WriteBlogContent />
    </Suspense>
  );
}
