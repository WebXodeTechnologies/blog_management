"use client";

import { useState } from "react";
import ExploreHero from "@/components/explore/ExploreHero";
import ExploreSearchFilter from "@/components/explore/ExploreSearchFilter";
import BlogFeed from "@/components/explore/BlogFeed";
import ExploreSidebar from "@/components/explore/ExploreSidebar";
import { STANDARDIZED_ARTICLES } from "@/constants/categories";
import SmoothScrollProvider from "@/components/homepage/SmoothScrollProvider";

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = STANDARDIZED_ARTICLES.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
        {/* 1. Header with Integrated Search */}
        <ExploreHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* 2. Medium 2-Column Grid Layout: Main Article Feed + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (8 cols): Article Feed & Category Tabs */}
          <div className="lg:col-span-8 space-y-6">
            <ExploreSearchFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <BlogFeed posts={filteredPosts} />
          </div>

          {/* Right Column (4 cols): Sticky Medium-Style Sidebar */}
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
