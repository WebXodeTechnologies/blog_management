"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Rss,
  Layers,
  Check,
  Plus,
  ArrowUpRight,
  Loader2,
  Sparkles,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";

export default function FollowingPage() {
  const [following, setFollowing] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchFollowingData = () => {
    fetch("/api/v1/user/following")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFollowing(data.following || []);
          setSuggested(data.suggested || []);
          setCategories(data.categories || []);
        }
      })
      .catch(() => toast.error("Failed to load network subscriptions"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFollowingData();
  }, []);

  const handleToggleFollow = async (targetUserId, name) => {
    if (actionLoading) return;
    setActionLoading(targetUserId);

    try {
      const res = await fetch("/api/v1/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(
          data.isFollowing ? `Following ${name}` : `Unfollowed ${name}`
        );
        fetchFollowingData();
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch {
      toast.error("Network communication error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="pb-16 text-slate-900 font-sans space-y-8">
      {/* Header Banner */}
      <div className="pb-6 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Users className="h-3.5 w-3.5" />
          <span>Subscriptions &amp; Network</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
          Following
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
          Manage your subscribed authors, tech publications, and topic feeds
          across the Texora platform.
        </p>
      </div>

      {/* Followed Authors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600" />
            <span>Followed Developers &amp; Authors ({following.length})</span>
          </h3>
        </div>

        {following.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-2 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-900">
              You are not following any authors yet
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Discover engineering contributors below and follow them to receive
              their latest technical insights in your stream.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {following.map((author) => {
              const avatarImg =
                author.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

              return (
                <div
                  key={author._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-between gap-4 shadow-2xs hover:border-indigo-200 transition"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <Image
                        src={avatarImg}
                        alt={author.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-heading font-bold text-sm text-slate-900 truncate">
                        {author.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {author.headline || author.bio || author.role || "Engineering Contributor"}
                      </p>
                      <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                        {author.articlesCount || 0} published articles
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleToggleFollow(author._id, author.name)
                    }
                    disabled={actionLoading === author._id}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                  >
                    {actionLoading === author._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Following</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Suggested Authors to Follow */}
      {suggested.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Recommended Tech Contributors</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggested.map((author) => {
              const avatarImg =
                author.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

              return (
                <div
                  key={author._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-between gap-4 shadow-2xs hover:border-indigo-200 transition"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <Image
                        src={avatarImg}
                        alt={author.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-heading font-bold text-xs text-slate-900 truncate">
                        {author.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {author.headline || author.bio || "Author"}
                      </p>
                      <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                        {author.articlesCount || 0} articles
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleToggleFollow(author._id, author.name)
                    }
                    disabled={actionLoading === author._id}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs"
                  >
                    {actionLoading === author._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Followed Publications & Categories */}
      <div className="space-y-4 pt-4">
        <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
          <Rss className="h-4 w-4 text-indigo-600" />
          <span>Subscribed Topics &amp; Engineering Streams</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.name}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-between gap-4 shadow-2xs hover:border-indigo-200 transition"
              >
                <div className="space-y-1 overflow-hidden">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                    Topic
                  </span>
                  <h4 className="font-heading font-bold text-sm text-slate-900 truncate">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {cat.count} published articles
                  </p>
                </div>

                <Link
                  href="/explore"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-600 transition border border-slate-200"
                  title="Explore Topic"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full p-6 rounded-3xl bg-white border border-slate-200/80 text-center text-slate-400 text-xs font-medium">
              No subscribed topic channels yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
