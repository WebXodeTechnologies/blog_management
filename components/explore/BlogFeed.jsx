"use client";

import BlogCard from "./BlogCard";
import { BookOpen } from "lucide-react";

export default function BlogFeed({ posts }) {
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
        <BlogCard key={post.slug || idx} post={post} />
      ))}
    </div>
  );
}
