"use client";

import { useState, useEffect } from "react";
import UserDashboardHero from "@/components/dashboard/UserDashboardHero";
import UserQuickActions from "@/components/dashboard/UserQuickActions";
import UserActivityStream from "@/components/dashboard/UserActivityStream";
import UserAdvancedInsights from "@/components/dashboard/UserAdvancedInsights";
import PollWidget from "@/components/polls/PollWidget";

export default function UserDashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePoll, setActivePoll] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [meRes, pollRes] = await Promise.all([
          fetch("/api/v1/auth/me"),
          fetch("/api/v1/user/poll"), // Optional: or fetch latest active poll via API
        ]);

        const meData = await meRes.json();
        if (meData.user) setUser(meData.user);

        const pollData = await pollRes.json();
        if (pollData.success && pollData.poll) {
          setActivePoll(pollData.poll);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
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
      <div className="space-y-6">
        {activePoll && user && (
          <PollWidget poll={activePoll} currentUserId={user._id} />
        )}
      </div>
    </div>
  );
}
