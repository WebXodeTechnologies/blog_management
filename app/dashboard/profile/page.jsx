"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Shield,
  Calendar,
  Sparkles,
  Activity,
  FileText,
  CheckCircle2,
  ArrowUpRight,
  Mail,
  HousePlus,
  Repeat2,
  Share2,
  Award,
  MapPin,
} from "lucide-react";
import EditProfileModal from "@/components/profile/EditProfileModal";
import toast from "react-hot-toast";

export default function DashboardProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isEditing, setIsEditing] = useState(false);

  const [userStories, setUserStories] = useState([]);
  const [repostedStories, setRepostedStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => toast.error("Failed to load user profile"))
      .finally(() => setLoading(false));

    Promise.all([
      fetch("/api/v1/user/explore?tab=your-list").then((res) => res.json()),
      fetch("/api/v1/user/explore?tab=reposts").then((res) => res.json()),
    ])
      .then(([publishedData, repostedData]) => {
        if (publishedData.success) setUserStories(publishedData.items || []);
        if (repostedData.success) setRepostedStories(repostedData.items || []);
      })
      .catch(() => {})
      .finally(() => setLoadingStories(false));
  }, []);

  const calculateCompletion = () => {
    if (!user) return 0;
    const fields = [
      user.name,
      user.avatar,
      user.bio,
      user.pronouns,
      user.socialLinks?.twitter ||
        user.socialLinks?.github ||
        user.socialLinks?.linkedin,
    ];
    const filled = fields.filter((f) => Boolean(f && String(f).trim())).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleCopyProfileLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const formatJoinedDate = (dateString) => {
    if (!dateString) return "August 2026";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return "August 2026";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-16 text-slate-900 font-sans space-y-8">
      {/* Light Glassmorphic Hero Card */}
      <div className="relative rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 lg:p-10 shadow-xl shadow-indigo-500/5 space-y-8 overflow-hidden font-sans">
        {/* Soft Pastel Animated Ambient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-tr from-indigo-200/50 to-sky-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200/40 to-pink-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-cyan-100/30 via-indigo-100/30 to-purple-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 space-y-6">
          {/* Main Profile Info Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {/* Glassmorphic Avatar Container */}
              <div className="relative shrink-0 p-1.5 rounded-3xl bg-white/80 backdrop-blur-xl border border-indigo-200/60 shadow-md shadow-indigo-500/10">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white shadow-xs bg-slate-50"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-indigo-50 to-sky-50 text-indigo-700 flex items-center justify-center font-heading font-black text-3xl border border-indigo-200/60 shadow-xs">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span
                  className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white ring-4 ring-white shadow-xs"
                  title="Verified Member"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* Identity Metadata */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-xs font-bold border border-indigo-200/80 backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                    <span className="capitalize">
                      {user?.role || "user"} Workspace
                    </span>
                  </span>
                  {user?.location && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-500/10 text-slate-700 text-xs font-medium border border-slate-200/80 backdrop-blur-md">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      {user.location}
                    </span>
                  )}
                </div>

                <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-black tracking-tight">
                  {user?.name}
                </h1>

                {user?.headline ? (
                  <p className="text-xs sm:text-sm text-slate-900 font-semibold max-w-xl leading-relaxed">
                    {user.headline}
                  </p>
                ) : (
                  user?.bio && (
                    <p className="text-xs sm:text-sm text-slate-900 font-medium line-clamp-2 max-w-xl leading-relaxed">
                      {user.bio}
                    </p>
                  )
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-900 font-semibold pt-0.5">
                  <span className="flex items-center gap-1.5 text-black">
                    <Mail className="h-3.5 w-3.5 text-indigo-600" />{" "}
                    {user?.email}
                  </span>
                  {user?.pronouns && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-black bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md font-bold text-[11px] border border-slate-300">
                        {user.pronouns}
                      </span>
                    </>
                  )}
                  <span className="text-slate-400">•</span>
                  <span className="flex items-center gap-1 text-slate-900 font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-slate-700" />
                    Joined {formatJoinedDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black hover:bg-slate-900 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-slate-900/20 border border-slate-900 hover:scale-105 active:scale-95"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={handleCopyProfileLink}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-black font-bold text-xs transition-all border border-slate-300 cursor-pointer backdrop-blur-md shadow-xs hover:shadow-md"
                title="Share Profile Link"
              >
                <Share2 className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Light Glassmorphic Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80">
            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xs hover:border-indigo-400 transition">
              <span className="text-[11px] font-bold text-slate-800 block">
                Published Stories
              </span>
              <span className="font-heading font-black text-2xl text-black mt-0.5 block">
                {userStories.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xs hover:border-emerald-400 transition">
              <span className="text-[11px] font-bold text-slate-800 block">
                Reposts Stream
              </span>
              <span className="font-heading font-black text-2xl text-emerald-700 mt-0.5 block">
                {repostedStories.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xs hover:border-indigo-400 transition">
              <span className="text-[11px] font-bold text-slate-800 block">
                Profile Completion
              </span>
              <span className="font-heading font-black text-2xl text-indigo-700 mt-0.5 block">
                {calculateCompletion()}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xs hover:border-emerald-400 transition">
              <span className="text-[11px] font-bold text-slate-800 block">
                Account Status
              </span>
              <span className="font-bold text-xs text-emerald-800 mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-8 gap-8">
        {/* Left Column: Navigation Tabs & Feed Content */}
        <div className="lg:col-span-10 space-y-6">
          {/* Surface Navigation Tab Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-2xs flex items-center gap-1 overflow-x-auto">
            {[
              {
                id: "home",
                label: "Home",
                icon: <HousePlus className="h-4 w-4" />,
              },
              {
                id: "reposts",
                label: "Reposts",
                icon: <Repeat2 className="h-4 w-4" />,
              },
              {
                id: "activity",
                label: "Activity",
                icon: <Activity className="h-4 w-4" />,
              },
              {
                id: "about",
                label: "About",
                icon: <Sparkles className="h-4 w-4" />,
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "text-white font-bold"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDashProfileTab"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="absolute inset-0 bg-indigo-600 rounded-xl shadow-xs shadow-indigo-500/20 z-0"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Body Content */}
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Published Stories
                  </h3>
                  <a
                    href="/dashboard/write"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    <span>Create new</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                {userStories.length > 0 ? (
                  <div className="space-y-4">
                    {userStories.map((story) => (
                      <div
                        key={story._id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                            {story.category || "General"}
                          </span>
                          <h4 className="font-heading font-bold text-sm text-slate-900 mt-1">
                            {story.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {story.excerpt}
                          </p>
                        </div>
                        <a
                          href={`/articles/${story.slug}`}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 transition shrink-0"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl bg-indigo-50/50 border border-dashed border-indigo-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        No stories published yet
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Share your engineering thoughts with the Texora
                        community.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "reposts" && (
              <motion.div
                key="reposts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Repeat2 className="h-5 w-5 text-emerald-600" />
                    <span>Reposted Stories</span>
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {repostedStories.length}{" "}
                    {repostedStories.length === 1 ? "Repost" : "Reposts"}
                  </span>
                </div>

                {repostedStories.length > 0 ? (
                  <div className="space-y-4">
                    {repostedStories.map((story) => (
                      <div
                        key={story._id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                            <span>By {story.authorId?.name || "Author"}</span>
                            <span>•</span>
                            <span className="text-indigo-600 font-medium">
                              {story.category || "General"}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-sm text-slate-900">
                            {story.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {story.excerpt}
                          </p>
                        </div>
                        <a
                          href={`/articles/${story.slug}`}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 transition shrink-0"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center mx-auto text-emerald-600">
                      <Repeat2 className="h-5 w-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      No reposted articles found in your stream.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4"
              >
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">
                  Security &amp; Session Audit
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-slate-900">
                        Authenticated via Secure HTTP-only Cookie JWT
                      </span>
                    </div>
                    <span className="text-indigo-600 font-semibold">
                      Active Session
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4"
              >
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Biography
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {user?.bio ||
                    "No bio provided yet. Click 'Edit Profile' to add your background, skills, and links."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Account Overview Metadata Card */}
        <div className="lg:col-span-10 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>Account Overview</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                    Active
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Personalized Author Workspace
                </p>
              </div>
              <div className="p-2 rounded-2xl bg-indigo-50 border border-indigo-100">
                <Shield className="h-4 w-4 text-indigo-600" />
              </div>
            </div>

            {/* Profile Completion Health Meter */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-900">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Profile Strength</span>
                </span>
                <span className="text-indigo-600 font-bold">
                  {calculateCompletion()}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-indigo-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateCompletion()}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition">
                <span className="flex items-center gap-2 text-slate-600">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Role Tier</span>
                </span>
                <span className="font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 capitalize text-[11px] border border-indigo-200">
                  {user?.role || "user"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition">
                <span className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Email Status</span>
                </span>
                <span className="font-semibold text-emerald-600 text-[11px]">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition">
                <span className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Member Since</span>
                </span>
                <span className="font-semibold text-slate-900">
                  {formatJoinedDate(user?.createdAt)}
                </span>
              </div>
            </div>

            {/* Deep Indigo Action Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer border border-indigo-500"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Update Profile Details</span>
              </button>

              <button
                onClick={handleCopyProfileLink}
                className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition border border-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>Share Profile Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditing(false)}
          onUpdateSuccess={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </div>
  );
}
