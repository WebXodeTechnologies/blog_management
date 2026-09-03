"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Repeat2,
  EyeOff,
  MoreHorizontal,
  Send,
  Trash2,
  Edit2,
  Check,
  X,
  Copy,
  MessageCircle,
  SendHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";

export default function BlogCard({ post, onUpdate }) {
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (post.comments) {
      setCommentsList(post.comments);
    }
  }, [post.comments]);

  if (isMuted) {
    return (
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex items-center justify-between my-2">
        <span>Story muted from your feed.</span>
        <button
          onClick={() => setIsMuted(false)}
          className="text-indigo-600 font-semibold hover:underline cursor-pointer"
        >
          Undo Mute
        </button>
      </div>
    );
  }

  const handleAction = async (actionType, extraPayload = {}) => {
    if (loadingAction) return;
    setLoadingAction(true);

    const payload = {
      blogId: post._id || post.id,
      action: actionType,
      ...extraPayload,
    };

    console.log(`🚀 [FRONTEND] Triggering action: ${actionType}`, payload);

    try {
      const res = await fetch("/api/v1/blogs/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      console.log(`📥 [FRONTEND] Response for ${actionType}:`, data);

      if (data.success) {
        if (onUpdate) onUpdate(data.blog);
        if (
          actionType === "comment" ||
          actionType === "edit-comment" ||
          actionType === "delete-comment"
        ) {
          console.log(
            "💬 [FRONTEND] Updating comments list state with:",
            data.blog.comments
          );
          setCommentsList(data.blog.comments || []);
          if (actionType === "comment") setCommentText("");
          if (actionType === "edit-comment") setEditingCommentId(null);
          toast.success("Comment updated successfully!");
        } else if (actionType === "like") {
          toast.success(data.isLiked ? "Liked story" : "Unliked story");
        } else if (actionType === "bookmark") {
          toast.success(
            data.isBookmarked
              ? "Saved to reading list"
              : "Removed from bookmarks"
          );
        } else if (actionType === "repost") {
          toast.success("Story reposted!");
        }
      } else {
        console.error("❌ [FRONTEND] Action failed message:", data.message);
        toast.error(data.message || "Action failed.");
      }
    } catch (err) {
      console.error("🔥 [FRONTEND] Network or execution error:", err);
      toast.error("Network communication error.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    handleAction("comment", { commentText: commentText.trim() });
  };

  const handleUpdateComment = (commentId) => {
    if (!editText.trim()) return;
    handleAction("edit-comment", { commentId, commentText: editText.trim() });
  };

  const handleDeleteComment = (commentId) => {
    handleAction("delete-comment", { commentId });
  };

  const authorName = post.authorId?.name || post.author?.name || "Tech Author";
  const authorAvatar =
    post.authorId?.avatar ||
    post.author?.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

  const cardImage = post.image || post.coverImage;
  const currentUserId = post.currentUserId;
  const isLiked = post.isLiked || false;
  const isBookmarked = post.isBookmarked || false;
  const isReposted = post.isReposted || false;
  const articleUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/articles/${post.slug}`
      : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative border-b border-slate-200/80 pb-8 pt-2 last:border-b-0 hover:bg-slate-50/50 rounded-3xl p-4 sm:p-6 transition-all"
    >
      <div className="flex items-start justify-between gap-6 sm:gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-7 w-7 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  width={28}
                  height={28}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-sans font-semibold text-slate-900">
                  {authorName}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-sans font-medium border border-indigo-100">
                  {post.category || "General"}
                </span>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-950 transition cursor-pointer"
                title="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-20 text-xs">
                  <button
                    onClick={() => {
                      setIsMuted(true);
                      setShowMenu(false);
                      toast("Muted story");
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                    <span>Mute this story</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/articles/${post.slug}`}
            className="block group-hover:text-indigo-600 transition-colors"
          >
            <h2 className="font-heading font-extrabold text-lg sm:text-2xl text-slate-950 mb-2 leading-snug tracking-tight">
              {post.title}
            </h2>
          </Link>

          <p className="text-xs sm:text-sm font-sans text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Action Bar */}
          <div className="flex items-center justify-between text-xs font-sans text-slate-500 pt-1">
            <div className="flex items-center gap-5">
              <button
                onClick={() => handleAction("like")}
                disabled={loadingAction}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isLiked
                      ? "text-rose-500 fill-rose-500"
                      : "text-slate-400 group-hover:text-rose-500"
                  }`}
                />
                <span className={isLiked ? "text-rose-500 font-bold" : ""}>
                  {post.likes || 0}
                </span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span>{commentsList.length}</span>
              </button>

              <button
                onClick={() => handleAction("repost")}
                disabled={loadingAction}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isReposted
                    ? "text-emerald-600 font-bold"
                    : "hover:text-emerald-600 text-slate-400"
                }`}
              >
                <Repeat2
                  className={`h-4 w-4 ${isReposted ? "text-emerald-600" : ""}`}
                />
                <span>{post.reposts || 0}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAction("bookmark")}
                disabled={loadingAction}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-400 hover:text-slate-950 hover:bg-slate-100"
                }`}
                title="Save Bookmark"
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? "fill-indigo-600" : ""}`}
                />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-all cursor-pointer"
                title="Share story"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a response..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Send className="h-3 w-3" />
                  <span>Post</span>
                </button>
              </form>

              <div className="space-y-2.5 pt-1">
                {commentsList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2 text-center">
                    No comments yet. Start the discussion!
                  </p>
                ) : (
                  commentsList.map((c, idx) => {
                    const commentUserId = c.userId?._id
                      ? c.userId._id.toString()
                      : c.userId
                        ? c.userId.toString()
                        : null;
                    const isOwner =
                      Boolean(
                        currentUserId &&
                        commentUserId === currentUserId.toString()
                      ) || Boolean(c.isAuthor);
                    const isEditing = editingCommentId === c._id;
                    const avatarImg =
                      c.userId?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
                    const userName =
                      c.userId?.name || c.name || "Community Member";

                    return (
                      <div
                        key={c._id || idx}
                        className="p-3 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={avatarImg}
                              alt={userName}
                              className="w-6 h-6 rounded-full object-cover border border-slate-200"
                            />
                            <span className="font-bold text-slate-900">
                              {userName}
                            </span>
                          </div>
                          {isOwner && !isEditing && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingCommentId(c._id);
                                  setEditText(c.comment || c.text);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 transition"
                                title="Edit comment"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(c._id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                                title="Delete comment"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-2 pt-1">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditingCommentId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleUpdateComment(c._id)}
                                className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" /> Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-600 pl-8">
                            {c.comment || c.text}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {cardImage && (
          <Link
            href={`/articles/${post.slug}`}
            className="relative w-28 h-20 sm:w-44 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-200/80 bg-slate-100 shadow-2xs group-hover:shadow-md transition-all"
          >
            <Image
              src={cardImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 112px, 176px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        )}
      </div>

      {/* External Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl border border-slate-200/90 text-slate-900 font-sans"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Share2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Share Article
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 max-w-60">
                    {post.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Direct Link Copy Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Direct Article Link
              </label>
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-indigo-600 transition">
                <input
                  type="text"
                  readOnly
                  value={articleUrl}
                  className="flex-1 bg-transparent px-3 text-xs text-slate-700 font-mono outline-none truncate"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(articleUrl);
                    toast.success("Link copied successfully!");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Social Share Grid */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Share to Network
              </label>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + articleUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 text-xs font-semibold text-slate-800 border border-slate-200/80 transition hover:border-slate-300 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 text-xs font-semibold text-slate-800 border border-slate-200/80 transition hover:border-slate-300 cursor-pointer"
                >
                  <span className="font-bold text-slate-900 text-sm leading-none">
                    𝕏
                  </span>
                  <span>X / Twitter</span>
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 text-xs font-semibold text-slate-800 border border-slate-200/80 transition hover:border-slate-300 cursor-pointer"
                >
                  <span className="font-extrabold text-blue-600 text-xs">
                    in
                  </span>
                  <span>LinkedIn</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 text-xs font-semibold text-slate-800 border border-slate-200/80 transition hover:border-slate-300 cursor-pointer"
                >
                  <SendHorizontal className="h-4 w-4 text-sky-500" />
                  <span>Telegram</span>
                </a>

                <a
                  href={`https://www.reddit.com/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 text-xs font-semibold text-slate-800 border border-slate-200/80 transition hover:border-slate-300 cursor-pointer"
                >
                  <span className="text-orange-600 text-xs">💬</span>
                  <span>Reddit</span>
                </a>

                <a
                  href={`https://medium.com/p/import?url=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 text-xs font-semibold text-slate-800 border border-slate-200/80 transition hover:border-slate-300 cursor-pointer"
                >
                  <span className="font-serif font-black text-slate-900 text-sm">
                    M
                  </span>
                  <span>Medium</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.article>
  );
}
