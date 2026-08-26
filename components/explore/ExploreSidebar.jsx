"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, UserPlus, Check, TrendingUp, BookOpen } from "lucide-react";
import { CATEGORIES, STANDARDIZED_ARTICLES } from "@/constants/categories";

const TOP_CREATORS = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Sr. System Architect",
    avatar: "/avatars/user1.png",
    followers: "14.2k",
  },
  {
    id: 2,
    name: "Tania Kapoor",
    role: "AI Core Engineer",
    avatar: "/avatars/user2.png",
    followers: "9.8k",
  },
  {
    id: 3,
    name: "David Chen",
    role: "Fullstack Lead",
    avatar: "/avatars/user3.png",
    followers: "11.5k",
  },
];

export default function ExploreSidebar({ onSelectTopic, selectedTopic }) {
  const [following, setFollowing] = useState({});

  const toggleFollow = (id) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const staffPicks = STANDARDIZED_ARTICLES.slice(0, 3);

  return (
    <aside className="space-y-8 sticky top-24 font-sans">
      {/* 1. Staff Picks / Curated Stories */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
          <h3 className="font-heading font-bold text-base text-slate-950">
            Staff Picks
          </h3>
        </div>

        <div className="space-y-4">
          {staffPicks.map((story) => (
            <Link
              key={story.id}
              href={`/blog/${story.slug}`}
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
      </div>

      {/* 2. Top Creators to Follow */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h3 className="font-heading font-bold text-base text-slate-950">
              Top Creators
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {TOP_CREATORS.map((creator) => {
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
      </div>

      {/* 3. Standardized Recommended Topics */}
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
