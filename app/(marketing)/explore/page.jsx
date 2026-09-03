"use client";

import { useState, useEffect } from "react";
import ExploreHero from "@/components/explore/ExploreHero";
import ExploreSearchFilter from "@/components/explore/ExploreSearchFilter";
import BlogFeed from "@/components/explore/BlogFeed";
import ExploreSidebar from "@/components/explore/ExploreSidebar";
import SmoothScrollProvider from "@/components/homepage/SmoothScrollProvider";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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

  const fetchExplorePosts = async () => {
    try {
      const tenantSlug = getActiveTenantSlug();
      const res = await fetch(`/api/v1/blogs?tenantSlug=${tenantSlug}`, {
        headers: {
          "x-tenant-slug": tenantSlug,
        },
      });
      const data = await res.json();
      if (data.success && data.blogs) {
        const publishedBlogs = data.blogs.filter(
          (b) => b.status === "published"
        );
        setPosts(publishedBlogs);
      }
    } catch {
      toast.error("Failed to load community stream");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (post.category &&
        post.category.toLowerCase() === selectedCategory.toLowerCase());

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      post.title?.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.authorId?.name?.toLowerCase().includes(query) ||
      post.category?.toLowerCase().includes(query);

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

            <BlogFeed posts={filteredPosts} setPosts={setPosts} />
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
