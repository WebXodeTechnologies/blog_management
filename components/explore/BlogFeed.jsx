"use client";

import BlogCard from "./BlogCard";
import { BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function BlogFeed({ posts, setPosts }) {
  const handleInteraction = async (blogId, action) => {
    try {
      const res = await fetch("/api/v1/blogs/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === blogId ? { ...post, ...data.blog } : post
          )
        );
      } else {
        toast.error(data.message || "Failed to update action.");
      }
    } catch {
      toast.error("Network error while recording interaction.");
    }
  };

  const handleUpdateSingle = (updatedBlog) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === updatedBlog._id ? { ...post, ...updatedBlog } : post
      )
    );
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 font-sans">
        <BookOpen className="mx-auto h-10 w-10 text-slate-400 mb-3" />
        <h3 className="font-heading font-bold text-base text-slate-800">
          No stories found
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-sans">
          Try searching for a different keyword or category topic.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {posts.map((post, idx) => (
        <BlogCard
          key={post._id || post.slug || idx}
          post={post}
          onLike={() => handleInteraction(post._id, "like")}
          onBookmark={() => handleInteraction(post._id, "bookmark")}
          onRepost={() => handleInteraction(post._id, "repost")}
          onUpdate={handleUpdateSingle}
        />
      ))}
    </div>
  );
}
