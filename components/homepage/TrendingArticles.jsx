"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Clock,
  Eye,
  Heart,
  Sparkles,
  Flame,
  TrendingUp,
  User,
} from "lucide-react";
import { CATEGORY_NAMES, STANDARDIZED_ARTICLES } from "@/constants/categories";
import { apiFetch } from "@/lib/api";

export default function TrendingArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const normalizeArticle = (b) => {
    const wordCount = b.content
      ? b.content
          .replace(/<[^>]*>/g, " ")
          .trim()
          .split(/\s+/).length
      : 0;
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

    const authorName =
      b.authorId?.name || b.author?.name || "Technical Contributor";
    const authorRole =
      b.authorId?.role || b.author?.role || "Engineering Author";
    const authorAvatar = b.authorId?.avatar || b.author?.avatar || "";

    const category =
      b.category ||
      (b.categoryId && typeof b.categoryId === "object"
        ? b.categoryId.name
        : null) ||
      (b.tags && b.tags.length > 0
        ? b.tags[0].charAt(0).toUpperCase() + b.tags[0].slice(1)
        : "System Architecture");

    const karmaVal = (b.likes || 0) * 100 + (b.views || 0) * 10;
    const karmaStr =
      karmaVal > 0
        ? `+${karmaVal > 999 ? (karmaVal / 1000).toFixed(1) + "k" : karmaVal} Karma`
        : "+100 Karma";

    return {
      id: b._id || b.id || b.slug,
      slug: b.slug,
      title: b.title,
      excerpt:
        b.excerpt ||
        (b.content
          ? b.content
              .replace(/<[^>]*>/g, " ")
              .slice(0, 150)
              .trim() + "..."
          : "Read full technical article..."),
      category: category,
      readTime: `${readTimeMin} min read`,
      views: b.views
        ? b.views > 999
          ? (b.views / 1000).toFixed(1) + "k"
          : b.views
        : 0,
      likes: b.likes || 0,
      karma: karmaStr,
      image:
        b.coverImage ||
        b.image ||
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      author: {
        name: authorName,
        role: authorRole,
        avatar: authorAvatar,
      },
    };
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchTrending() {
      try {
        setLoading(true);
        const res = await apiFetch("/api/v1/blogs");
        const data = await res.json();
        if (data.success && Array.isArray(data.blogs)) {
          const published = data.blogs.filter((b) => b.status === "published");
          if (published.length > 0) {
            const normalized = published.map(normalizeArticle);
            if (isMounted) {
              setArticles(normalized);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch trending articles:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayArticles =
    articles.length > 0 ? articles : STANDARDIZED_ARTICLES;

  const filteredArticles =
    activeCategory === "All"
      ? displayArticles
      : displayArticles.filter((article) => {
          if (!article.category) return false;
          const cat = article.category.toLowerCase();
          const target = activeCategory.toLowerCase();
          return (
            cat === target ||
            cat.includes(target) ||
            target.includes(cat) ||
            (target.includes("ai") && cat.includes("ai")) ||
            (target.includes("web") && cat.includes("web")) ||
            (target.includes("system") && cat.includes("system")) ||
            (target.includes("startup") && cat.includes("startup"))
          );
        });

  const featuredArticle = filteredArticles[0] || displayArticles[0];
  const sideArticles =
    filteredArticles.length > 1
      ? filteredArticles.slice(1, 4)
      : displayArticles.slice(1, 4);

  if (loading) {
    return (
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 animate-pulse">
          <div className="space-y-3">
            <div className="h-6 w-64 bg-slate-200/80 rounded-full" />
            <div className="h-10 w-72 bg-slate-200/80 rounded-2xl" />
          </div>
          <div className="h-10 w-36 bg-slate-200/80 rounded-2xl shrink-0" />
        </div>

        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2 animate-pulse scrollbar-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-24 bg-slate-200/80 rounded-full shrink-0"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-7 h-120 bg-white/70 rounded-3xl border border-slate-200/70 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="aspect-video w-full bg-slate-200/80 rounded-2xl" />
              <div className="h-6 w-3/4 bg-slate-200/80 rounded-lg" />
              <div className="h-4 w-full bg-slate-200/80 rounded-lg" />
            </div>
            <div className="h-8 w-full bg-slate-100/80 rounded-xl" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-37 bg-white/70 rounded-3xl border border-slate-200/70 p-5 flex items-center gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-20 bg-slate-200/80 rounded-full" />
                  <div className="h-5 w-full bg-slate-200/80 rounded-lg" />
                  <div className="h-3 w-4/5 bg-slate-200/80 rounded-lg" />
                </div>
                <div className="h-16 w-16 bg-slate-200/80 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-300/60 bg-blue-50/80 backdrop-blur-md text-blue-700 text-xs font-sans font-semibold mb-4 shadow-2xs">
            <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-bounce" />
            <span>Curated Stories for Students, Engineers &amp; Founders</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
            Trending Publications
          </h2>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-900 text-xs font-sans font-semibold hover:bg-slate-950 hover:text-white shadow-xs hover:shadow-md transition-all group shrink-0"
        >
          <span>Explore All Stories</span>
          <ArrowUpRight className="h-4 w-4 text-blue-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </Link>
      </div>

      {/* Standardized Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_NAMES.map((catName) => {
          const isActive = activeCategory === catName;
          return (
            <button
              key={catName}
              onClick={() => setActiveCategory(catName)}
              className={`relative text-xs px-4 py-2 rounded-full font-sans transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                isActive
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20 font-semibold"
                  : "bg-white/75 text-slate-600 border border-slate-200/70 hover:bg-white hover:text-slate-950 hover:border-slate-300"
              }`}
            >
              <span>{catName}</span>
            </button>
          );
        })}
      </div>

      {/* Asymmetric Layout: Left Featured Spotlight + Right Vertical Stream */}
      <AnimatePresence mode="wait">
        {featuredArticle && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            {/* Left Column (7 cols): Main Featured Spotlight Card */}
            <div className="lg:col-span-7 flex">
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="relative w-full rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.12)] hover:border-blue-500/50 transition-all group overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle Ambient Hover Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Spotlight Unsplash Image Container */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6 bg-slate-900 border border-slate-200/80 shadow-inner">
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority
                    />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-sans font-semibold border border-white/20 shadow-md">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        {featuredArticle.category}
                      </span>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-xs font-sans font-bold shadow-md">
                        <TrendingUp className="w-3 h-3" />
                        {featuredArticle.karma}
                      </span>
                    </div>
                  </div>

                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 ring-2 ring-blue-500/20 bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                        {featuredArticle.author.avatar ? (
                          <Image
                            src={featuredArticle.author.avatar}
                            alt={featuredArticle.author.name}
                            width={36}
                            height={36}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <User className="h-4 w-4 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-sans font-bold text-slate-950">
                          {featuredArticle.author.name}
                        </h4>
                        <p className="text-[11px] font-sans text-slate-500">
                          {featuredArticle.author.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-sans text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />{" "}
                        {featuredArticle.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-950 group-hover:text-blue-600 transition-colors mb-3 leading-snug">
                    {featuredArticle.title}
                  </h3>

                  <p className="text-sm font-sans text-slate-600 leading-relaxed mb-6">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-sans font-semibold text-slate-950">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-slate-400" />{" "}
                      {featuredArticle.views}
                    </span>
                    <span className="flex items-center gap-1 text-rose-600 font-medium">
                      <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />{" "}
                      {featuredArticle.likes}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Read Full Story</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Column (5 cols): Stacked Vertical Stream */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {sideArticles.map((article, idx) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="relative rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)] hover:border-blue-500/40 transition-all group overflow-hidden flex flex-col justify-between flex-1"
                >
                  <div className="flex items-start gap-4">
                    {/* Number Index Pill */}
                    <span className="font-heading text-2xl font-black text-slate-200 group-hover:text-blue-500 transition-colors shrink-0">
                      0{idx + 2}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-sans font-semibold border border-blue-100">
                          {article.category}
                        </span>

                        <span className="text-[11px] font-sans text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {article.readTime}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-base text-slate-950 group-hover:text-blue-600 transition-colors mb-1.5 leading-snug">
                        {article.title}
                      </h4>

                      <p className="text-xs font-sans text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Thumbnail Image */}
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 hidden sm:block">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Article Footer Stats */}
                  <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-sans text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="relative h-5 w-5 rounded-full overflow-hidden shrink-0 bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                        {article.author.avatar ? (
                          <Image
                            src={article.author.avatar}
                            alt={article.author.name}
                            width={20}
                            height={20}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <User className="h-3 w-3 text-indigo-600" />
                        )}
                      </div>
                      <span className="font-medium text-slate-700">
                        {article.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-rose-600 font-medium">
                        <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />{" "}
                        {article.likes}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
