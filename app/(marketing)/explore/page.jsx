"use client";

import { useState, useEffect } from "react";
import ExploreHero from "@/components/explore/ExploreHero";
import ExploreSearchFilter from "@/components/explore/ExploreSearchFilter";
import BlogFeed from "@/components/explore/BlogFeed";
import ExploreSidebar from "@/components/explore/ExploreSidebar";
import SmoothScrollProvider from "@/components/homepage/SmoothScrollProvider";
import { Loader2 } from "lucide-react";

function getActiveTenantSlug() {
  if (typeof window === "undefined") return "general";
  try {
    const stored = localStorage.getItem("activeTenantSlug");
    if (stored) return stored;
    const hostname = window.location.hostname;
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";
    if (hostname.endsWith(rootDomain) && hostname !== rootDomain) {
      const subdomain = hostname.replace(`.${rootDomain}`, "").split(":")[0];
      if (subdomain && subdomain !== "www" && subdomain !== "app") {
        return subdomain;
      }
    }
  } catch {}
  return "general";
}

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const tenantSlug = getActiveTenantSlug();
    fetch(`/api/v1/blogs?tenantSlug=${tenantSlug}`, {
      headers: {
        "x-tenant-slug": tenantSlug,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blogs) {
          const formattedPosts = data.blogs
            .filter((b) => b.status === "published")
            .map((b) => ({
              id: b._id,
              slug: b.slug,
              title: b.title,
              excerpt: b.excerpt || "Explore technical insights...",
              category: b.category || "Architecture",
              image:
                b.coverImage ||
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
              readTime: `${Math.max(1, Math.ceil((b.content?.length || 1000) / 1000))} min read`,
              views: b.views || 0,
              likes: b.likes || 0,
              createdAt: b.createdAt,
              author: b.authorId
                ? {
                    name: b.authorId.name || "Technical Author",
                    avatar:
                      b.authorId.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
                  }
                : {
                    name: "Technical Author",
                    avatar:
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
                  },
            }));
          setPosts(formattedPosts);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
        <ExploreHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <ExploreSearchFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <BlogFeed posts={filteredPosts} />
          </div>

          <div className="lg:col-span-4">
            <ExploreSidebar
              onSelectTopic={(topic) => setSelectedCategory(topic)}
              selectedTopic={selectedCategory}
            />
          </div>
        </div>
      </div>
    </SmoothScrollProvider>
  );
}
