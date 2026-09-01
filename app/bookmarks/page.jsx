"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  Search,
  Clock,
  ArrowUpRight,
  Trash2,
  BookOpen,
  Eye,
  Heart,
} from "lucide-react";
import { STANDARDIZED_ARTICLES } from "@/constants/categories";
import toast from "react-hot-toast";

export default function BookmarksPage() {
  const [savedArticles, setSavedArticles] = useState(
    STANDARDIZED_ARTICLES.slice(0, 4)
  );
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemoveBookmark = (id, title) => {
    setSavedArticles(savedArticles.filter((a) => a.id !== id));
    toast.success(`Removed "${title}" from your bookmarks.`);
  };

  const filteredBookmarks = savedArticles.filter((article) => {
    const matchesTag =
      selectedTag === "All" ||
      article.category.toLowerCase() === selectedTag.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const categories = ["All", "Frontend", "Backend", "AI & ML", "Architecture"];

  return (
    <div className="pb-16 text-slate-900 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
            <Bookmark className="h-3.5 w-3.5 text-indigo-600" />
            <span>Personal Reading List</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Saved Bookmarks
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Quick access to technical articles, tutorials, and system design patterns you have saved for later.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
          <input
            type="text"
            placeholder="Search saved reading list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs transition"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedTag(cat)}
            className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              selectedTag === cat
                ? "bg-indigo-600 text-white font-bold shadow-xs border border-indigo-500"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-indigo-50/60 hover:text-indigo-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">No saved bookmarks</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              You haven&apos;t added any articles to your reading list matching this filter. Explore articles to save your favorites.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition border border-indigo-500"
          >
            Explore Tech Pulse Feed
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-indigo-50/50 border border-indigo-100">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-700/90 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                    {article.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="relative h-5 w-5 rounded-full overflow-hidden shrink-0 border border-indigo-200">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={20}
                        height={20}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-700">
                      {article.author.name}
                    </span>
                  </div>
                  <span className="text-[11px] flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {article.readTime}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-slate-400" /> {article.views}
                  </span>
                  <span className="flex items-center gap-1 text-rose-500 font-medium">
                    <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> {article.likes}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRemoveBookmark(article.id, article.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Read Article"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
