"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Users,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import logo from "@/public/logos/logo2.png";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function LoginForm({ selectedRole, onRoleChange }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      router.push(callbackUrl || "/explore");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: "user", label: "User / Reader", icon: <Users className="h-4 w-4" /> },
    {
      id: "moderator",
      label: "Moderator",
      icon: <ShieldAlert className="h-4 w-4" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-slate-200/85 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.1)] transition-all relative overflow-hidden font-sans"
    >
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Mobile Brand Logo Header */}
      <div className="lg:hidden flex items-center justify-center mb-6 pt-2">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <Image
            src={logo}
            alt="Texora Logo"
            width={38}
            height={38}
            className="rounded-xl shadow-xs group-hover:scale-105 transition-transform"
          />
          <span className="font-brand font-black text-2xl tracking-tight text-slate-950">
            Texora
          </span>
        </Link>
      </div>

      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-700 text-xs font-sans font-semibold mb-3 shadow-2xs cursor-default"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
          <span>Welcome Back</span>
        </motion.div>

        <h1 className="font-brand font-black text-2xl sm:text-3xl text-slate-950 mb-2 tracking-tight">
          Sign In
        </h1>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-sans font-medium flex items-center gap-2 shadow-xs"
          >
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5 font-sans"
      >
        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-sans font-semibold text-slate-700 mb-2">
            Select Portal Access
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/70">
            {roles.map((r) => {
              const isActive = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onRoleChange(r.id)}
                  className="relative flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-sans font-semibold transition-colors cursor-pointer z-10"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRoleTab"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                      }}
                      className="absolute inset-0 bg-slate-950 rounded-xl shadow-md z-0"
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-1.5 ${
                      isActive
                        ? "text-white"
                        : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    {r.icon}
                    <span className="truncate">{r.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-xs font-sans font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/90 text-sm font-sans text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-sans font-semibold text-slate-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 font-sans font-semibold hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/90 text-sm font-sans text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 sm:py-4 px-4 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-sans font-semibold text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="relative flex py-5 items-center">
        <div className="grow border-t border-slate-200"></div>
        <span className="shrink mx-4 text-xs font-medium text-slate-400">
          Or continue with
        </span>
        <div className="grow border-t border-slate-200"></div>
      </div>

      {/* Google OAuth Button */}
      <GoogleAuthButton />

      {/* Footer Link */}
      <p className="text-center text-xs font-sans text-slate-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 font-sans font-semibold hover:underline"
        >
          Register now
        </Link>
      </p>
    </motion.div>
  );
}
