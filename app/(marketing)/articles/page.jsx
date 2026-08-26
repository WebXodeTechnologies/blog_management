"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Clock,
  Eye,
  Heart,
  BookOpen,
  Search,
} from "lucide-react";
import { CATEGORY_NAMES, STANDARDIZED_ARTICLES } from "@/constants/categories";

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = STANDARDIZED_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" ||
      article.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 backdrop-blur-md text-blue-700 text-xs font-sans font-semibold mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            <span>Curated Publications</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-slate-950">
            Technical Articles &amp; Insights
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-xl">
            Explore deep technical narratives, architecture benchmarks, and
            growth strategies written for students, developers &amp; founders.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles & topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 text-xs sm:text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Standardized Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_NAMES.map((catName) => {
          const isActive = selectedCategory === catName;
          return (
            <button
              key={catName}
              onClick={() => setSelectedCategory(catName)}
              className={`text-xs px-4 py-2 rounded-full font-sans transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-slate-950 text-white font-semibold shadow-md shadow-slate-900/10"
                  : "bg-white/80 text-slate-600 border border-slate-200/70 hover:bg-white hover:text-slate-950"
              }`}
            >
              {catName}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] hover:border-blue-500/40 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              {/* Unsplash Image Cover */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-sans font-semibold border border-white/80 shadow-xs">
                  {article.category}
                </span>
              </div>

              {/* Author & Read Time */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden shrink-0 border border-slate-200">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      width={24}
                      height={24}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <span className="text-xs font-sans font-medium text-slate-700">
                    {article.author.name}
                  </span>
                </div>
                <span className="text-[11px] font-sans text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-heading font-bold text-xl text-slate-950 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="text-xs font-sans text-slate-600 leading-relaxed line-clamp-2 mb-6">
                {article.excerpt}
              </p>
            </div>

            {/* Footer Stats */}
            <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs font-sans text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-slate-400" /> {article.views}
                </span>
                <span className="flex items-center gap-1 text-rose-600 font-medium">
                  <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />{" "}
                  {article.likes}
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
