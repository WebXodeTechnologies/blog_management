"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import authSvg from "@/public/auth/Working from anywhere-cuate.svg";
import logo from "@/public/logos/logo2.png";

export default function AuthLeftHero({ selectedRole }) {
  return (
    <div className="hidden lg:flex lg:col-span-5 relative p-8 xl:p-12 flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. Framer Motion Multi-Color Glowing Ambient Mesh Orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -35, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/6 -left-16 w-96 h-96 bg-linear-to-tr from-blue-400/20 to-cyan-400/20 blur-[120px] rounded-full pointer-events-none z-0"
      />

      {/* Subtle Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[28px_28px] opacity-25 pointer-events-none z-0" />

      {/* 2. Top Brand Header with Bouncing Logo */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Image
              src={logo}
              alt="Texora Logo"
              width={44}
              height={44}
              className="rounded-xl shadow-xs"
              priority
            />
          </motion.div>
          <span className="font-brand font-black text-2xl sm:text-3xl tracking-tight text-slate-950">
            Texora
          </span>
        </Link>
      </div>

      {/* 3. Center Showcase with Bouncing Framer Motion SVG Illustration & Floating Badges */}
      <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center text-center w-full">
        {/* Floating Interactive Pill Badges */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 left-4 hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-semibold text-blue-600"
        >
          <Zap className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
          <span>Real-time Feeds</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-2 hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-semibold text-emerald-600"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Role Protected</span>
        </motion.div>

        {/* Big Bouncing Framer Motion SVG Illustration */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotateZ: [0, 1.2, -1.2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full max-w-sm xl:max-w-md h-72 sm:h-80 xl:h-96 flex items-center justify-center filter drop-shadow-[0_25px_40px_rgba(59,130,246,0.18)]"
        >
          <Image
            src={authSvg}
            alt="Technical creator illustration"
            fill
            sizes="(max-width: 1280px) 384px, 448px"
            priority
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Minimalist Sub-Pill Tag with Spring Switch Animation */}
        <motion.div
          key={selectedRole}
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-slate-800 text-xs font-sans font-semibold shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
          <span>
            {selectedRole === "moderator"
              ? "Moderator Command Hub"
              : "Technical Creator Workspace"}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
