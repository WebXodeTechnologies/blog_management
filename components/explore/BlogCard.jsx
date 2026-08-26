"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageSquare, Bookmark, Share2 } from "lucide-react";

export default function BlogCard({ post }) {
  const [likes, setLikes] = useState(post.likesCount || 142);
  const [isLiked, setIsLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
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
          <div className="flex items-center gap-2.5 mb-3">
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
              <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                •
              </span>
              <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Article Title */}
          <Link
            href={`/blog/${post.slug}`}
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

          {/* Bottom Interactive Actions Strip */}
          <div className="flex items-center justify-between text-xs font-sans text-slate-500 pt-1">
            <div className="flex items-center gap-5">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLiked
                    ? "text-rose-500 font-semibold"
                    : "hover:text-rose-500"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`}
                />
                <span>{likes}</span>
              </button>

              <div className="flex items-center gap-1.5 text-slate-500">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span>{post.commentsCount || 24}</span>
              </div>

              <span className="text-slate-400 text-[11px] sm:hidden">
                {post.readTime}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBookmark}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  saved
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:text-slate-950 hover:bg-slate-100"
                }`}
                title={saved ? "Saved" : "Save story"}
              >
                <Bookmark
                  className={`h-4 w-4 ${saved ? "fill-blue-600" : ""}`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      url: window.location.origin + `/blog/${post.slug}`,
                    });
                  }
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-all cursor-pointer"
                title="Share story"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Aspect-Ratio Thumbnail Cover Image */}
        {post.image && (
          <Link
            href={`/blog/${post.slug}`}
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
    </motion.article>
  );
}
