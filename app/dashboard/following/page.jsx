"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Rss, Layers, Check, Plus, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

export default function FollowingPage() {
  const [followedAuthors, setFollowedAuthors] = useState([
    {
      id: "AUT-1",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "Lead Systems Architect",
      articlesCount: 42,
      isFollowing: true,
    },
    {
      id: "AUT-2",
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
      role: "Distributed Database Eng",
      articlesCount: 28,
      isFollowing: true,
    },
  ]);

  const [followedPublications, setFollowedPublications] = useState([
    {
      id: "PUB-1",
      name: "Tech Pulse Engineering",
      slug: "tech-pulse",
      followers: "14.2k",
      isFollowing: true,
    },
    {
      id: "PUB-2",
      name: "Rust & Async Systems",
      slug: "rust-async",
      followers: "8.9k",
      isFollowing: true,
    },
  ]);

  const toggleAuthorFollow = (id, name) => {
    setFollowedAuthors((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const next = !a.isFollowing;
          toast.success(next ? `Following ${name}` : `Unfollowed ${name}`);
          return { ...a, isFollowing: next };
        }
        return a;
      })
    );
  };

  return (
    <div className="pb-16 text-foreground font-sans space-y-8">
      <div className="pb-6 border-b border-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
          <Users className="h-3.5 w-3.5" />
          <span>Subscriptions &amp; Network</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-foreground tracking-tight">
          Following
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-xl">
          Manage your subscribed authors, tech publications, and topic feeds across the Texora platform.
        </p>
      </div>

      {/* Followed Authors */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>Followed Developers &amp; Authors ({followedAuthors.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followedAuthors.map((author) => (
            <div
              key={author.id}
              className="p-5 rounded-3xl bg-surface border border-border flex items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-border shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="font-heading font-bold text-sm text-foreground truncate">
                    {author.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">{author.role}</p>
                  <p className="text-[10px] text-primary font-semibold mt-0.5">
                    {author.articlesCount} technical articles
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleAuthorFollow(author.id, author.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  author.isFollowing
                    ? "bg-muted text-foreground border border-border hover:bg-rose-500/10 hover:text-rose-600"
                    : "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs"
                }`}
              >
                {author.isFollowing ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Followed Publications */}
      <div className="space-y-4 pt-4">
        <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
          <Rss className="h-4 w-4 text-indigo-500" />
          <span>Followed Publications &amp; Subdomains</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followedPublications.map((pub) => (
            <div
              key={pub.id}
              className="p-5 rounded-3xl bg-surface border border-border flex items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1 overflow-hidden">
                <h4 className="font-heading font-bold text-sm text-foreground truncate">
                  {pub.name}
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  {pub.slug}.texora.dev
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {pub.followers} subscribers
                </p>
              </div>

              <Link
                href={`/dashboard/${pub.slug}/analytics`}
                className="p-2.5 rounded-xl bg-muted hover:bg-surface-hover text-foreground transition border border-border"
                title="View Tenant Workspace"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
