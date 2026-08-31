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
  Layers,
  CheckCircle2,
  ArrowUpRight,
  UserCheck,
  Mail,
  HousePlus,
  Repeat2,
  Share2,
  Copy,
  Lock,
  Zap,
  Check,
  Globe,
  Award,
} from "lucide-react";
import EditProfileModal from "@/components/profile/EditProfileModal";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => toast.error("Failed to load user profile"))
      .finally(() => setLoading(false));
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 text-foreground">
      {/* SaaS Hero Banner with Primary Gradient Accent */}
      <div className="relative text-background pt-16 pb-24 px-6 sm:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-border shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center font-brand font-black text-3xl shadow-2xl">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-black text-xs font-semibold">
                <Sparkles className="h-3 w-3" />
                <span className="capitalize">{user?.role} Workspace</span>
              </div>
              <h1 className="font-brand font-black text-3xl sm:text-4xl tracking-tight text-black">
                {user?.name}
              </h1>
              <p className="text-xs text-black font-medium flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {user?.email}
                </span>
                {user?.pronouns && (
                  <>
                    <span>•</span>
                    <span className="text-black bg-white/10 px-2 py-0.5 rounded-md">
                      {user.pronouns}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-black transition-all shadow-md cursor-pointer backdrop-blur-md"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Navigation Tabs & Content Feed */}
          <div className="lg:col-span-8 space-y-6">
            {/* Clean Surface Tab Bar */}
            <div className="bg-surface border border-border rounded-2xl p-1.5 shadow-sm flex items-center gap-1 overflow-x-auto">
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
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeProfileTab"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="absolute inset-0 bg-foreground rounded-xl shadow-xs z-0"
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
                  className="bg-surface border border-border rounded-3xl p-8 shadow-xs space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h3 className="font-heading font-bold text-lg text-foreground">
                      Published Stories
                    </h3>
                    <a
                      href="/dashboard/tech-pulse/blog/create"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Create new</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <div className="p-12 rounded-2xl bg-muted/50 border border-dashed border-border text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface shadow-xs border border-border flex items-center justify-center mx-auto text-muted-foreground">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        No stories published yet
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Share your engineering thoughts with the Texora
                        community.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "reposts" && (
                <motion.div
                  key="reposts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-surface border border-border rounded-3xl p-8 shadow-xs text-center py-16"
                >
                  <p className="text-xs text-muted-foreground font-medium">
                    No reposted articles found in your stream.
                  </p>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-surface border border-border rounded-3xl p-8 shadow-xs space-y-4"
                >
                  <h3 className="font-heading font-bold text-lg text-foreground mb-4">
                    Security & Session Audit
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border text-xs">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-foreground">
                          Authenticated via Secure HTTP-only Cookie JWT
                        </span>
                      </div>
                      <span className="text-muted-foreground">Active</span>
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
                  className="bg-surface border border-border rounded-3xl p-8 shadow-xs space-y-4"
                >
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    Biography
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {user?.bio ||
                      "No bio provided yet. Click 'Edit Profile' to add your background, skills, and links."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Metadata & Quick Stats Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Main Account Overview Card */}
            <div className="relative bg-surface border border-border rounded-3xl p-6 shadow-xl space-y-6 overflow-hidden">
              {/* Subtle top background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                    <span>Account Overview</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                      Active
                    </span>
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Personalized Author Workspace
                  </p>
                </div>
                <div className="p-2 rounded-2xl bg-muted/60 border border-border">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
              </div>

              {/* Profile Completion Health Meter */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Profile Strength</span>
                  </span>
                  <span className="text-primary font-bold">
                    {calculateCompletion()}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateCompletion()}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-linear-to-r from-primary to-blue-500 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {calculateCompletion() < 100
                    ? "Add your bio & social links to reach 100%."
                    : "Your profile is fully optimized! 🎉"}
                </p>
              </div>

              {/* Key Details Grid */}
              <div className="space-y-3 pt-2 border-t border-border text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/40 transition">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>Role Tier</span>
                  </span>
                  <span className="font-semibold px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary capitalize text-[11px] border border-primary/20">
                    {user?.role || "user"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/40 transition">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Email Status</span>
                  </span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1 text-[11px]">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/40 transition">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Member Since</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatJoinedDate(user?.createdAt)}
                  </span>
                </div>
              </div>

              {/* Connected Social Networks */}
              {user?.socialLinks &&
                (user.socialLinks.twitter ||
                  user.socialLinks.github ||
                  user.socialLinks.linkedin) && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground mb-2">
                      Connected Networks
                    </p>
                    <div className="flex items-center gap-2">
                      {user.socialLinks.twitter && (
                        <a
                          href={user.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition border border-border"
                          title="Twitter / X"
                        >
                          <span className="font-bold text-xs">𝕏</span>
                        </a>
                      )}
                      {user.socialLinks.github && (
                        <a
                          href={user.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition border border-border"
                          title="GitHub"
                        >
                          <svg
                            className="h-3.5 w-3.5 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {user.socialLinks.linkedin && (
                        <a
                          href={user.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition border border-border"
                          title="LinkedIn"
                        >
                          <svg
                            className="h-3.5 w-3.5 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border space-y-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 rounded-2xl bg-foreground hover:bg-primary text-background font-semibold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Edit3 className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                  <span>Update Profile Details</span>
                </button>

                <button
                  onClick={handleCopyProfileLink}
                  className="w-full py-2.5 rounded-2xl bg-muted/60 hover:bg-muted text-foreground font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-border"
                >
                  <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Share Profile Link</span>
                </button>
              </div>
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
