import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs/blog.model";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";
import { verifyModeratorRequest } from "@/modules/rbac/rbac.guard";
import { ModerationService } from "@/modules/moderation";

const moderationService = new ModerationService();

export async function GET(req) {
  const guard = await verifyModeratorRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    await connectDB();

    const queueItems = await moderationService.getPendingQueue();

    // Compute real MongoDB stats for dashboard analytics
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const approvedToday = await Blog.countDocuments({
      status: "published",
      updatedAt: { $gte: startOfToday },
    });

    const totalSafetyActions = await AuditLog.countDocuments({
      action: {
        $in: [
          "APPROVED_POST",
          "SUSPENDED_POST",
          "MODERATOR_EDIT",
          "AUTO_FLAGGED",
        ],
      },
    });

    // Fetch real immutable audit log documents from MongoDB
    const auditLogs = await AuditLog.find({
      entityType: "Blog",
    })
      .populate("actorId", "name role seniorityLevel")
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedLogs = auditLogs.map((log) => ({
      id: `LOG-${log._id.toString().slice(-4).toUpperCase()}`,
      moderator: log.actorId?.name || "Safety System Bot",
      action: log.action,
      target: log.details?.title || log.entityId?.toString() || "Blog Post",
      reason: log.details?.reason || "Policy compliance check",
      timestamp: log.createdAt
        ? new Date(log.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Just now",
      type:
        log.action === "APPROVED_POST"
          ? "success"
          : log.action === "SUSPENDED_POST"
            ? "danger"
            : "warning",
    }));

    return NextResponse.json(
      {
        success: true,
        queue: queueItems,
        stats: {
          pending: queueItems.length,
          approvedToday: approvedToday,
          flagged: queueItems.filter((i) => i.riskLevel === "high").length,
          safetyActions: totalSafetyActions,
        },
        auditLogs: formattedLogs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [GET /api/v1/moderation] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const guard = await verifyModeratorRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    await connectDB();
    const body = await req.json();
    const { blogId, actionType, reason, title } = body;

    if (!blogId || !actionType) {
      return NextResponse.json(
        { success: false, message: "blogId and actionType are required" },
        { status: 400 }
      );
    }

    const result = await moderationService.processModerationAction(
      blogId,
      actionType,
      reason,
      title,
      guard.user
    );

    return NextResponse.json(
      {
        success: true,
        blog: result.blog,
        auditLog: result.auditLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [POST /api/v1/moderation] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
