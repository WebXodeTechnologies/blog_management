"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  UserPlus,
  Check,
  TrendingUp,
  BookOpen,
  Loader2,
} from "lucide-react";
import { CATEGORIES } from "@/constants/categories";

function getActiveTenantSlug() {
  if (typeof window === "undefined") return "general";
  try {
    return localStorage.getItem("activeTenantSlug") || "general";
  } catch {
    return "general";
  }
}

export default function ExploreSidebar({ onSelectTopic, selectedTopic }) {
  const [following, setFollowing] = useState({});
  const [staffPicks, setStaffPicks] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [loadingPicks, setLoadingPicks] = useState(true);
  const [loadingCreators, setLoadingCreators] = useState(true);

  useEffect(() => {
    const tenantSlug = getActiveTenantSlug();

    // Fetch Staff Picks
    fetch(`/api/v1/blogs?tenantSlug=${tenantSlug}`, {
      headers: { "x-tenant-slug": tenantSlug },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blogs) {
          const published = data.blogs
            .filter((b) => b.status === "published")
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 3)
            .map((b) => ({
              id: b._id,
              slug: b.slug,
              title: b.title,
              readTime: `${Math.max(1, Math.ceil((b.content?.length || 1000) / 1000))} min read`,
              author: {
                name: b.authorId?.name || "Technical Author",
                avatar:
                  b.authorId?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
              },
            }));
          setStaffPicks(published);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPicks(false));

    // Fetch Top Creators
    fetch(`/api/v1/creators?tenantSlug=${tenantSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.creators) {
          setTopCreators(data.creators);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingCreators(false));
  }, []);

  const toggleFollow = (id) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="space-y-8 sticky top-24 font-sans">
      {/* 1. Staff Picks */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
          <h3 className="font-heading font-bold text-base text-slate-950">
            Staff Picks
          </h3>
        </div>

        {loadingPicks ? (
          <div className="flex py-6 justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        ) : staffPicks.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">
            No staff picks available yet.
          </p>
        ) : (
          <div className="space-y-4">
            {staffPicks.map((story) => (
              <Link
                key={story.id}
                href={`/articles/${story.slug}`}
                className="block group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="relative h-5 w-5 rounded-full overflow-hidden shrink-0 border border-slate-200">
                    <Image
                      src={story.author.avatar}
                      alt={story.author.name}
                      width={20}
                      height={20}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    {story.author.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    • {story.readTime}
                  </span>
                </div>
                <h4 className="font-heading font-semibold text-xs text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {story.title}
                </h4>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 2. Top Creators (Dynamic from Database) */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h3 className="font-heading font-bold text-base text-slate-950">
              Top Creators
            </h3>
          </div>
        </div>

        {loadingCreators ? (
          <div className="flex py-6 justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          </div>
        ) : topCreators.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No creators found.</p>
        ) : (
          <div className="space-y-4">
            {topCreators.map((creator) => {
              const isFollowing = following[creator.id];
              return (
                <div
                  key={creator.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={creator.avatar}
                        alt={creator.name}
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-950">
                        {creator.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {creator.role}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                      isFollowing
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-950 text-white hover:bg-blue-600"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Recommended Topics */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-purple-600" />
          <h3 className="font-heading font-bold text-base text-slate-950">
            Recommended Topics
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.name !== "All").map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectTopic(cat.name)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedTopic === cat.name
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-200/60"
              }`}
            >
              #{cat.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
