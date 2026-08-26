"use client";

import { useState } from "react";
import AuthLeftHero from "@/components/login/AuthLeftHero";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("user");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 text-slate-950 font-sans selection:bg-blue-600 selection:text-white overflow-hidden relative">
      {/* Shared Global Multi-Color Ambient Mesh Light Glow */}
      <div className="absolute top-1/4 right-1/4 w-120 sm:w-150 h-96 sm:h-125 bg-linear-to-tr from-blue-400/15 via-indigo-400/15 to-purple-400/15 blur-[120px] sm:blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Left 5 Columns: Framer Motion Hero Showcase (Visible on lg+) */}
      <AuthLeftHero selectedRole={selectedRole} />

      {/* Right 7 Columns: Responsive Modular Login Form (Centered on all screen sizes) */}
      <div className="lg:col-span-7 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative z-10">
        <LoginForm selectedRole={selectedRole} onRoleChange={setSelectedRole} />
      </div>
    </div>
  );
}
