"use client";

import { useState } from "react";
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
} from "lucide-react";

const CATEGORIES = [
  { name: "All", count: 4 },
  { name: "System Design", count: 1 },
  { name: "AI", count: 1 },
  { name: "Web Development", count: 1 },
  { name: "Founder's Note", count: 1 },
];

const ARTICLES = [
  {
    id: 1,
    slug: "mastering-nextjs-app-router",
    category: "System Design",
    title: "Mastering Next.js 16 App Router & Server Actions at Scale",
    excerpt:
      "A deep architectural dive into building resilient micro-frontends, ISR invalidation, and Redis caching strategies with React 19 Server Components.",
    readTime: "5 min read",
    views: "3.8k",
    likes: 420,
    karma: "+1.2k Karma",
    featured: true,
    author: {
      name: "Alex Rivera",
      avatar: "/avatars/user1.png",
      role: "Sr. System Architect",
    },
    image: "/articles/arch.png",
  },
  {
    id: 2,
    slug: "scaling-llm-infrastructure",
    category: "AI",
    title: "Architecting Low-Latency AI Pipelines with Distributed Workers",
    excerpt:
      "How we reduced LLM inference latency by 65% using BullMQ worker queues, Redis stream processing, and custom token streaming.",
    readTime: "8 min read",
    views: "3.4k",
    likes: 680,
    karma: "+890 Karma",
    featured: false,
    author: {
      name: "Tania Kapoor",
      avatar: "/avatars/user2.png",
      role: "AI Systems Lead",
    },
    image: "/articles/ai.png",
  },
  {
    id: 3,
    slug: "tailwind-glassmorphism-design-system",
    category: "Web Development",
    title: "Crafting High-Craft Glassmorphic UI Design Systems in 2026",
    excerpt:
      "Advanced CSS techniques for frosted glass depth, dynamic aura lighting, fluid animations, and flawless accessibility.",
    readTime: "4 min read",
    views: "4.1k",
    likes: 512,
    karma: "+650 Karma",
    featured: false,
    author: {
      name: "David Chen",
      avatar: "/avatars/user3.png",
      role: "UI Engineer",
    },
    image: "/articles/webdev.png",
  },
  {
    id: 4,
    slug: "bootstrap-to-series-a-tech-saas",
    category: "Founder's Note",
    title: "From 0 to 50k Active Creators: Lessons in SaaS Scale",
    excerpt:
      "The engineering trade-offs, developer community flywheel, and database partitioning decisions that fueled our scale.",
    readTime: "6 min read",
    views: "5.2k",
    likes: 930,
    karma: "+1.5k Karma",
    featured: false,
    author: {
      name: "Elena Rostova",
      avatar: "/avatars/user4.png",
      role: "Co-Founder",
    },
    image: "/articles/business.png",
  },
];

export default function TrendingArticles() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles =
    activeCategory === "All"
      ? ARTICLES
      : ARTICLES.filter(
          (article) =>
            article.category.toLowerCase() === activeCategory.toLowerCase()
        );

  const featuredArticle =
    filteredArticles.find((a) => a.featured) || filteredArticles[0];

  const sideArticles = filteredArticles.filter(
    (a) => a.id !== featuredArticle?.id
  );

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Header Strip with Glowing Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-300/60 bg-blue-50/80 backdrop-blur-md text-blue-700 text-xs font-sans font-semibold mb-4 shadow-2xs">
            <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-bounce" />
            <span>Curated Developer Stories</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
            Trending Engineering Insights
          </h2>
        </div>

        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-900 text-xs font-sans font-semibold hover:bg-slate-950 hover:text-white shadow-xs hover:shadow-md transition-all group shrink-0"
        >
          <span>Explore All Publications</span>
          <ArrowUpRight className="h-4 w-4 text-blue-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </Link>
      </div>

      {/* Cyberpunk Category Capsule Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`relative text-xs px-4 py-2 rounded-full font-sans font-medium transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                isActive
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20 font-semibold"
                  : "bg-white/75 text-slate-600 border border-slate-200/70 hover:bg-white hover:text-slate-950 hover:border-slate-300"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Unique Asymmetric Layout: Left Featured Showcase + Right Vertical Stream */}
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
                href={`/blog/${featuredArticle.slug}`}
                className="relative w-full rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.12)] hover:border-blue-500/50 transition-all group overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle Ambient Hover Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Spotlight Image Container */}
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
                      <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 ring-2 ring-blue-500/20">
                        <Image
                          src={featuredArticle.author.avatar}
                          alt={featuredArticle.author.name}
                          width={36}
                          height={36}
                          className="object-cover h-full w-full"
                        />
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

            {/* Right Column (5 cols): Stacked Vertical Magazine Feed */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {sideArticles.map((article, idx) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
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
                      <div className="relative h-5 w-5 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={article.author.avatar}
                          alt={article.author.name}
                          width={20}
                          height={20}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <span className="font-medium text-slate-700">
                        {article.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
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
