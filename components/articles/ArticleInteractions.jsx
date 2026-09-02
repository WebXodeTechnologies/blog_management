"use client";

import { useState } from "react";
import { Heart, MessageSquare, Share2, Repeat2, LogIn, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ArticleInteractions({
  articleId,
  initialLikes = 0,
  initialCommentsCount = 0,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);

  // Check auth and execute action or show modal
  const handleProtectedAction = async (actionCallback) => {
    try {
      const res = await fetch("/api/v1/auth/me");
      const data = await res.json();

      if (!data.user) {
        setShowLoginModal(true);
        return;
      }

      actionCallback(data.user);
    } catch {
      setShowLoginModal(true);
    }
  };

  const handleLike = () => {
    handleProtectedAction(async () => {
      try {
        const newLikedState = !hasLiked;
        setHasLiked(newLikedState);
        setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));

        // Call backend API to persist like/clap
        await fetch(`/api/v1/blogs/${articleId}/like`, { method: "POST" });
        toast.success(newLikedState ? "Liked article!" : "Unliked");
      } catch {
        toast.error("Failed to update reaction");
      }
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  const handleRepost = () => {
    handleProtectedAction(() => {
      toast.success("Article reposted to your workspace feed!");
    });
  };

  return (
    <>
      {/* Interaction Toolbar */}
      <div className="flex items-center justify-between py-4 border-y border-slate-200 my-8 text-slate-600">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-xs font-semibold transition cursor-pointer hover:text-rose-500 ${
              hasLiked ? "text-rose-500" : ""
            }`}
          >
            <Heart className={`h-5 w-5 ${hasLiked ? "fill-rose-500" : ""}`} />
            <span>{likes} Claps/Likes</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-xs font-semibold transition cursor-pointer hover:text-indigo-600"
          >
            <MessageSquare className="h-5 w-5" />
            <span>{commentsCount} Comments</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleRepost}
            className="p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            title="Repost"
          >
            <Repeat2 className="h-5 w-5" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-100 text-center relative space-y-4">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <LogIn className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Authentication Required
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You must be logged into your account to clap, comment, or
                interact with stories.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                href="/login"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition text-center"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
