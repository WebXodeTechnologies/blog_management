"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export default function ArticleBackground({ children }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      650px circle at ${mouseX}px ${mouseY}px,
      rgba(59, 130, 246, 0.14),
      rgba(147, 51, 234, 0.08),
      transparent 80%
    )
  `;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col bg-slate-50 text-slate-950 selection:bg-blue-600 selection:text-white overflow-x-hidden"
    >
      {/* Global Interactive Cursor Spotlight Glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: spotlightBackground }}
      />

      {/* Global Floating Animated Ambient Light Orbs */}
      <motion.div
        animate={{
          y: [0, -60, 0],
          x: [0, 40, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed top-[10%] left-[15%] w-150 h-125 bg-linear-to-tr from-blue-400/20 to-cyan-400/20 blur-[150px] rounded-full pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [0, 70, 0],
          x: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed top-[45%] right-[10%] w-137.5 h-112.5 bg-linear-to-tr from-purple-400/18 to-pink-400/18 blur-[160px] rounded-full pointer-events-none z-0"
      />

      <div className="relative z-10 flex-1">{children}</div>
    </div>
  );
}
