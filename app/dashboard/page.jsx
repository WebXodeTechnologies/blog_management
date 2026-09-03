"use client";

import { useState, useEffect } from "react";
import UserDashboardHero from "@/components/dashboard/UserDashboardHero";
import UserQuickActions from "@/components/dashboard/UserQuickActions";
import UserActivityStream from "@/components/dashboard/UserActivityStream";
import UserAdvancedInsights from "@/components/dashboard/UserAdvancedInsights";

export default function UserDashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Hero Overview */}
      <UserDashboardHero user={user} />

      {/* Quick Actions Hub */}
      <UserQuickActions />

      {/* Activity Stream & Reader Engagement Visuals */}
      <UserActivityStream />
      <UserAdvancedInsights />
    </div>
  );
}
