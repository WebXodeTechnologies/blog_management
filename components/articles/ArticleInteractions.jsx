"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Repeat2,
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

export default function ArticleInteractions({ articleId, initialPost = null }) {
  const [post, setPost] = useState(initialPost || {});
  const [isLiked, setIsLiked] = useState(initialPost?.isLiked || false);
  const [likes, setLikes] = useState(initialPost?.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(
    initialPost?.isBookmarked || false
  );
  const [isReposted, setIsReposted] = useState(
    initialPost?.isReposted || false
  );
  const [reposts, setReposts] = useState(initialPost?.reposts || 0);
  const [commentsList, setCommentsList] = useState(initialPost?.comments || []);

  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    fetch("/api/v1/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blogs) {
          const match = data.blogs.find(
            (b) => b._id?.toString() === articleId?.toString()
          );
          if (match) {
            setPost(match);
            setIsLiked(match.isLiked || false);
            setLikes(match.likes || 0);
            setIsBookmarked(match.isBookmarked || false);
            setIsReposted(match.isReposted || false);
            setReposts(match.reposts || 0);
            setCommentsList(match.comments || []);
          }
        }
      })
      .catch(() => {});
  }, [articleId]);

  const handleAction = async (actionType, extraPayload = {}) => {
    if (loadingAction) return;
    setLoadingAction(true);

    try {
      const res = await fetch("/api/v1/blogs/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: articleId,
          action: actionType,
          ...extraPayload,
        }),
      });
      const data = await res.json();

      if (data.success && data.blog) {
        const updated = data.blog;
        setIsLiked(updated.isLiked || false);
        setLikes(updated.likes || 0);
        setIsBookmarked(updated.isBookmarked || false);
        setIsReposted(updated.isReposted || false);
        setReposts(updated.reposts || 0);
        setCommentsList(updated.comments || []);

        if (
          actionType === "comment" ||
          actionType === "edit-comment" ||
          actionType === "delete-comment"
        ) {
          if (actionType === "comment") setCommentText("");
          if (actionType === "edit-comment") setEditingCommentId(null);
          toast.success("Comment updated successfully!");
        } else if (actionType === "like") {
          toast.success(updated.isLiked ? "Liked story" : "Unliked story");
        } else if (actionType === "bookmark") {
          toast.success(
            updated.isBookmarked
              ? "Saved to reading list"
              : "Removed from bookmarks"
          );
        } else if (actionType === "repost") {
          toast.success("Story reposted!");
        }
      } else {
        toast.error(data.message || "Action failed.");
      }
    } catch {
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

  const currentUserId = post.currentUserId;
  const articleSlug = post.slug || "";
  const articleUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/articles/${articleSlug}`
      : "";

  return (
    <div className="mt-8 pt-6 border-t border-slate-200/80 font-sans">
      {/* Interaction Toolbar */}
      <div className="rounded-3xl bg-slate-50/90 border border-slate-200/90 p-3 sm:p-4 text-xs font-sans text-slate-700 shadow-2xs">
        {/* Mobile View: Vertical Column Stack (flex-col) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Primary Action Buttons Stack (Like, Comment, Repost) */}
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
            <button
              onClick={() => handleAction("like")}
              disabled={loadingAction}
              className={`flex items-center justify-center sm:justify-start gap-2 p-2.5 sm:p-0 rounded-2xl bg-white sm:bg-transparent border sm:border-0 border-slate-200/80 font-semibold hover:opacity-80 transition cursor-pointer group shadow-2xs sm:shadow-none ${
                isLiked ? "text-rose-500 font-bold" : "text-slate-700"
              }`}
            >
              <Heart
                className={`h-4 w-4 transition-colors shrink-0 ${
                  isLiked
                    ? "text-rose-500 fill-rose-500"
                    : "text-slate-400 group-hover:text-rose-500"
                }`}
              />
              <span>
                {likes}{" "}
                <span className="hidden xs:inline sm:inline">Likes</span>
              </span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center justify-center sm:justify-start gap-2 p-2.5 sm:p-0 rounded-2xl bg-white sm:bg-transparent border sm:border-0 border-slate-200/80 font-semibold text-slate-700 hover:text-slate-900 transition cursor-pointer shadow-2xs sm:shadow-none"
            >
              <MessageSquare className="h-4 w-4 text-slate-400 shrink-0" />
              <span>
                {commentsList.length}{" "}
                <span className="hidden xs:inline sm:inline">Comments</span>
              </span>
            </button>

            <button
              onClick={() => handleAction("repost")}
              disabled={loadingAction}
              className={`flex items-center justify-center sm:justify-start gap-2 p-2.5 sm:p-0 rounded-2xl bg-white sm:bg-transparent border sm:border-0 border-slate-200/80 font-semibold transition cursor-pointer shadow-2xs sm:shadow-none ${
                isReposted
                  ? "text-emerald-600 font-bold"
                  : "hover:text-emerald-600 text-slate-700"
              }`}
            >
              <Repeat2
                className={`h-4 w-4 shrink-0 ${
                  isReposted ? "text-emerald-600" : "text-slate-400"
                }`}
              />
              <span>
                {reposts}{" "}
                <span className="hidden xs:inline sm:inline">Reposts</span>
              </span>
            </button>
          </div>

          {/* Secondary Actions Stack (Bookmark, Share) */}
          <div className="flex items-center justify-between sm:justify-start gap-2 border-t sm:border-t-0 border-slate-200/80 pt-2.5 sm:pt-0">
            <button
              onClick={() => handleAction("bookmark")}
              disabled={loadingAction}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 p-2.5 sm:p-2 rounded-2xl sm:rounded-xl transition cursor-pointer border sm:border-0 border-slate-200/80 ${
                isBookmarked
                  ? "bg-indigo-50 sm:bg-indigo-100 text-indigo-600 font-bold"
                  : "bg-white sm:bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Save Bookmark"
            >
              <Bookmark
                className={`h-4 w-4 shrink-0 ${
                  isBookmarked
                    ? "fill-indigo-600 text-indigo-600"
                    : "text-slate-400"
                }`}
              />
              <span className="sm:hidden text-xs font-semibold">
                {isBookmarked ? "Saved" : "Bookmark"}
              </span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 p-2.5 sm:p-2 rounded-2xl sm:rounded-xl bg-white sm:bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border sm:border-0 border-slate-200/80"
              title="Share Article"
            >
              <Share2 className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="sm:hidden text-xs font-semibold">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="mt-4 p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 shadow-2xs">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a response..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
            />
            <button
              type="submit"
              disabled={loadingAction}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Post</span>
            </button>
          </form>

          <div className="space-y-3 pt-1">
            {commentsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No comments yet. Be the first to start the discussion!
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
                    currentUserId && commentUserId === currentUserId.toString()
                  ) || Boolean(c.isAuthor);
                const isEditing = editingCommentId === c._id;
                const avatarImg =
                  c.userId?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
                const userName = c.userId?.name || c.name || "Community Member";

                return (
                  <div
                    key={c._id || idx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
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
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                            title="Edit comment"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(c._id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Delete comment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateComment(c._id)}
                            className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="h-3 w-3" /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600 pl-8 leading-relaxed">
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
                    {post.title || "Technical Article"}
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
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent((post.title || "Article") + " - " + articleUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 text-xs font-semibold text-slate-800 border border-slate-200/80 transition hover:border-slate-300 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title || "Article")}&url=${encodeURIComponent(articleUrl)}`}
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
                  href={`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(post.title || "Article")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 text-xs font-semibold text-slate-800 border border-slate-200/80 transition hover:border-slate-300 cursor-pointer"
                >
                  <SendHorizontal className="h-4 w-4 text-sky-500" />
                  <span>Telegram</span>
                </a>

                <a
                  href={`https://www.reddit.com/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(post.title || "Article")}`}
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
    </div>
  );
}
