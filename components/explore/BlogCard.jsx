"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Repeat2,
  VolumeX,
  EyeOff,
  MoreHorizontal,
  X,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

export default function BlogCard({ post }) {
  const [likes, setLikes] = useState(post.likesCount || 142);
  const [isLiked, setIsLiked] = useState(false);
  const [reposts, setReposts] = useState(post.repostsCount || 18);
  const [isReposted, setIsReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([
    { id: 1, name: "Alex Rivera", text: "Exceptional architecture breakdown! Bookmarking for our team sprint." },
  ]);

  if (isMuted) {
    return (
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex items-center justify-between my-2">
        <span>Story muted from your feed.</span>
        <button
          onClick={() => setIsMuted(false)}
          className="text-blue-600 font-semibold hover:underline cursor-pointer"
        >
          Undo Mute
        </button>
      </div>
    );
  }

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
      toast.success("Added to your liked stories!");
    }
  };

  const handleRepost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isReposted) {
      setReposts((prev) => prev - 1);
      setIsReposted(false);
      toast("Removed repost from your profile.");
    } else {
      setReposts((prev) => prev + 1);
      setIsReposted(true);
      toast.success("Story reposted to your profile!");
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList((prev) => [
      ...prev,
      { id: Date.now(), name: "You", text: commentText.trim() },
    ]);
    setCommentText("");
    toast.success("Comment added!");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + `/articles/${post.slug}`);
      toast.success("Link copied to clipboard!");
      setShowShareModal(false);
    }
  };

  const handleMuteStory = () => {
    setIsMuted(true);
    setShowMenu(false);
    toast("Muted story");
  };

  const handleMutePublication = () => {
    setIsMuted(true);
    setShowMenu(false);
    toast(`Muted publication: ${post.category}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative border-b border-slate-200/80 pb-8 pt-2 last:border-b-0 hover:bg-slate-50/50 rounded-3xl p-4 sm:p-6 transition-all"
    >
      <div className="flex items-start justify-between gap-6 sm:gap-8">
        {/* Left Side: Article Story Content */}
        <div className="flex-1 min-w-0">
          {/* Author Header Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-7 w-7 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={28}
                  height={28}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-sans font-semibold text-slate-900">
                  {post.author.name}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-sans font-medium border border-blue-100">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Overflow Dropdown for Mute Story & Mute Publication */}
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
                    onClick={handleMuteStory}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                    <span>Mute this story</span>
                  </button>
                  <button
                    onClick={handleMutePublication}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <VolumeX className="h-3.5 w-3.5 text-rose-500" />
                    <span>Mute publication</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Article Title */}
          <Link
            href={`/articles/${post.slug}`}
            className="block group-hover:text-blue-600 transition-colors"
          >
            <h2 className="font-heading font-extrabold text-lg sm:text-2xl text-slate-950 mb-2 leading-snug tracking-tight">
              {post.title}
            </h2>
          </Link>

          {/* Article Excerpt */}
          <p className="text-xs sm:text-sm font-sans text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Bottom Interactive Actions Strip: Like, Comment, Repost, Share */}
          <div className="flex items-center justify-between text-xs font-sans text-slate-500 pt-1">
            <div className="flex items-center gap-5">
              {/* 1. Like Trigger */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLiked ? "text-rose-500 font-semibold" : "hover:text-rose-500"
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{likes}</span>
              </button>

              {/* 2. Comment Trigger */}
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-950 transition cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span>{commentsList.length}</span>
              </button>

              {/* 3. Repost Trigger */}
              <button
                onClick={handleRepost}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isReposted ? "text-emerald-600 font-semibold" : "hover:text-emerald-600"
                }`}
              >
                <Repeat2 className="h-4 w-4" />
                <span>{reposts}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Bookmark */}
              <button
                onClick={() => {
                  setSaved(!saved);
                  toast.success(saved ? "Removed bookmark" : "Saved to reading list!");
                }}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  saved ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                <Bookmark className={`h-4 w-4 ${saved ? "fill-blue-600" : ""}`} />
              </button>

              {/* 4. External Share Trigger */}
              <button
                onClick={() => setShowShareModal(true)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-all cursor-pointer"
                title="Share story"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Comment Drawer Section */}
          {showComments && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a technical response..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-blue-600 transition cursor-pointer flex items-center gap-1"
                >
                  <Send className="h-3 w-3" />
                  <span>Post</span>
                </button>
              </form>

              <div className="space-y-2 pt-1">
                {commentsList.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-white border border-slate-100 text-xs">
                    <span className="font-bold text-slate-950 block">{c.name}</span>
                    <p className="text-slate-600 mt-0.5">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Cover Image */}
        {post.image && (
          <Link
            href={`/articles/${post.slug}`}
            className="relative w-28 h-20 sm:w-44 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-200/80 bg-slate-100 shadow-2xs group-hover:shadow-md transition-all"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 112px, 176px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-heading font-bold text-base text-slate-950">Share Technical Story</h4>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-950 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 line-clamp-1 font-semibold">{post.title}</p>

            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-900 border border-slate-200 transition text-left cursor-pointer"
              >
                🔗 Copy Direct Link
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://texora.dev/articles/${post.slug}`)}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full p-3 rounded-2xl bg-slate-950 text-white text-xs font-semibold transition text-left hover:bg-slate-800"
              >
                𝕏 Share on Twitter / X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://texora.dev/articles/${post.slug}`)}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full p-3 rounded-2xl bg-blue-600 text-white text-xs font-semibold transition text-left hover:bg-blue-500"
              >
                💼 Share on LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.article>
  );
}
