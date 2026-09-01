import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import { User } from "@/modules/auth/user.model";

export async function GET(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const moderators = await User.find({ role: "moderator" })
      .select("name email avatar createdAt")
      .sort({ createdAt: -1 });

    const queueStats = {
      pendingReviews: 3,
      flaggedComments: 7,
      openTickets: 2,
      resolvedToday: 14,
    };

    const sampleTickets = [
      {
        id: "TCK-9021",
        subject: "Reported Spam Article: 'Crypto AI Token Scam'",
        reporter: "dev_alex@texora.io",
        priority: "high",
        status: "open",
        createdAt: new Date().toISOString(),
      },
      {
        id: "TCK-8812",
        subject: "Copyright Infringement Notice on React 19 Guide",
        reporter: "legal@techbrand.com",
        priority: "urgent",
        status: "in_review",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "TCK-7719",
        subject: "Abusive comment thread in System Design topic",
        reporter: "sarah_m@dev.org",
        priority: "medium",
        status: "resolved",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    return NextResponse.json(
      {
        moderators,
        queueStats,
        tickets: sampleTickets,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch moderator queue" },
      { status: 500 }
    );
  }
}
