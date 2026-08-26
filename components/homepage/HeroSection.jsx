"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe, Users, TrendingUp, Zap } from "lucide-react";

const ACTIONS = ["Xplore", "Share", "Create", "Elevate"];

const COMMUNITY_USERS = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Sr. System Architect",
    avatar: "/avatars/user1.png",
    status: "online",
  },
  {
    id: 2,
    name: "Tania Kapoor",
    role: "AI Core Engineer",
    avatar: "/avatars/user2.png",
    status: "online",
  },
  {
    id: 3,
    name: "David Chen",
    role: "Fullstack Lead",
    avatar: "/avatars/user3.png",
    status: "online",
  },
  {
    id: 4,
    name: "Elena Rostova",
    role: "Principal DevRel",
    avatar: "/avatars/user4.png",
    status: "online",
  },
];

const FEATURED_TAGS = [
  "#SystemDesign",
  "#AI_ML",
  "#NextJS16",
  "#WebPerformance",
  "#CloudNative",
];

export default function HeroSection() {
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Typewriter Loop Logic for Actions
  useEffect(() => {
    const fullAction = ACTIONS[currentActionIndex];
    let timeout;

    if (!isDeleting) {
      if (currentText.length < fullAction.length) {
        timeout = setTimeout(() => {
          setCurrentText(fullAction.slice(0, currentText.length + 1));
        }, 120);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(fullAction.slice(0, currentText.length - 1));
        }, 80);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentActionIndex((prev) => (prev + 1) % ACTIONS.length);
        }, 50);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentActionIndex]);

  return (
    <section className="relative pt-16 pb-16 sm:pt-24 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10 font-sans">
      <div className="max-w-4xl mx-auto text-center w-full">
        {/* Main Headline with Orbitron Font for Action + Ideas & Connect with Aura */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 min-h-[2.4em] sm:min-h-[2.1em]"
        >
          <h1 className="flex items-center justify-center flex-wrap gap-x-3 font-orbitron font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.12]">
            <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block font-orbitron">
              {currentText}
            </span>
            <span className="w-1.5 h-10 sm:h-16 bg-blue-600 inline-block animate-pulse rounded-full align-middle -ml-1" />
            <span className="text-slate-950 font-orbitron">Ideas.</span>
          </h1>
          <span className="font-orbitron text-slate-800 text-3xl sm:text-5xl lg:text-6xl mt-3 block font-bold tracking-tight opacity-95">
            Connect with Aura.
          </span>
        </motion.div>

        {/* Subtitle - Inter Font */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-sans font-normal leading-relaxed mb-10"
        >
          Welcome to{" "}
          <strong className="text-slate-950 font-semibold font-orbitron">
            TEXORA
          </strong>{" "}
          — the premier technical publishing platform. Explore system
          architectures, share deep engineering insights, and amplify your aura
          in a vibrant developer ecosystem.
        </motion.p>

        {/* Action Buttons - Inter Font */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-linear-to-r from-slate-950 via-slate-900 to-blue-950 text-white text-sm font-sans font-semibold hover:from-slate-900 hover:to-indigo-950 shadow-lg shadow-slate-900/15 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all group border border-slate-800"
          >
            <span className="font-sans">Start Xploring Free</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-blue-400" />
          </Link>

          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border border-slate-200/80 bg-white/75 backdrop-blur-xl text-slate-800 text-sm font-sans font-semibold hover:bg-white hover:border-slate-300 hover:text-slate-950 shadow-xs hover:shadow-md transition-all group"
          >
            <Globe className="h-4 w-4 text-blue-600 group-hover:rotate-12 transition-transform" />
            <span className="font-sans">Explore Community</span>
          </Link>
        </motion.div>

        {/* Trending Topic Tags Pill Strip - Inter Font */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12 font-sans"
        >
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1 font-sans">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Trending
            Topics:
          </span>
          {FEATURED_TAGS.map((tag, idx) => (
            <span
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`text-xs px-3.5 py-1.5 rounded-full cursor-pointer font-sans transition-all ${
                activeTab === idx
                  ? "bg-blue-100 text-blue-700 font-semibold border border-blue-200 shadow-xs"
                  : "bg-white/70 text-slate-600 border border-slate-200/60 hover:bg-white hover:text-slate-900"
              }`}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Enhanced Interactive Community Aura Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-3xl mx-auto rounded-3xl bg-white/75 backdrop-blur-xl border border-slate-200/60 p-6 sm:p-7 text-left shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-blue-400/40 hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)] transition-all font-sans"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100/80">
            {/* Active Aura Info */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-linear-to-tr from-blue-500 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
                <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-slate-950 text-base sm:text-lg">
                    Active Developer Aura
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-sans font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    12.4k Online
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
                  Connecting software engineers, architects & technical writers
                  worldwide.
                </p>
              </div>
            </div>

            {/* Stacked User Avatars */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="flex -space-x-3 overflow-hidden p-1">
                {COMMUNITY_USERS.map((user) => (
                  <div
                    key={user.id}
                    className="relative group/avatar cursor-pointer"
                    title={`${user.name} • ${user.role}`}
                  >
                    <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full ring-2 ring-white shadow-sm overflow-hidden bg-slate-100 transition-transform group-hover/avatar:scale-110 group-hover/avatar:z-20">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                        priority
                      />
                    </div>
                    {/* Status Dot */}
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                ))}
                {/* Plus Count Pill */}
                <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full ring-2 ring-white bg-slate-900 text-white font-sans font-semibold text-xs shadow-sm cursor-pointer hover:bg-blue-600 transition-colors">
                  +12k
                </div>
              </div>
            </div>
          </div>

          {/* Featured Creator Spotlight Snippet */}
          <div className="mt-5 pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/70 rounded-2xl p-4 border border-slate-100/80 font-sans">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 border border-blue-200">
                <Image
                  src={COMMUNITY_USERS[0].avatar}
                  alt={COMMUNITY_USERS[0].name}
                  width={40}
                  height={40}
                  className="object-cover h-full w-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-sans font-semibold text-slate-900">
                    {COMMUNITY_USERS[0].name}
                  </span>
                  <span className="text-[10px] font-sans text-slate-400">
                    • 5 min read
                  </span>
                </div>
                <p className="text-xs font-sans font-medium text-slate-700 line-clamp-1 mt-0.5">
                  &quot;Architecting Event-Driven Micro-Frontends with Next.js
                  16 &amp; Redis&quot;
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans font-medium text-blue-600 bg-blue-50/90 px-3 py-1.5 rounded-xl border border-blue-100 shrink-0 self-end sm:self-center">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Trending #1</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
