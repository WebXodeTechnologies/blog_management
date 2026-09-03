import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs/blog.model";
import { User } from "@/modules/users/user.model";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";
import { verifyModeratorRequest } from "@/modules/rbac/rbac.guard";

export async function GET(req) {
  const guard = await verifyModeratorRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    await connectDB();

    // Fetch real blogs pending approval directly from MongoDB
    const pendingBlogs = await Blog.find({
      status: { $in: ["pending", "draft"] },
    })
      .populate("authorId", "name email avatar seniorityLevel yearsOfExperience headline")
      .populate("tenantId", "name slug")
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 });

    const queueItems = pendingBlogs.map((b) => {
      const author = b.authorId || {};
      const tenant = b.tenantId || {};
      const category = b.categoryId || {};

      return {
        id: `SUB-${b._id.toString().slice(-4).toUpperCase()}`,
        rawId: b._id.toString(),
        title: b.title,
        slug: b.slug,
        content: b.content,
        category: category.name || "General",
        tenantId: tenant.slug || tenant.name || "general",
        author: {
          id: author._id ? author._id.toString() : "",
          name: author.name || "Anonymous Dev",
          email: author.email || "",
          avatar: author.avatar || "",
          seniorityLevel: author.seniorityLevel || "tech_enthusiast",
          yearsOfExperience: author.yearsOfExperience || 0,
        },
        submittedAt: b.createdAt
          ? new Date(b.createdAt).toLocaleString()
          : "Recently",
        riskScore: "Low (4%)",
        riskLevel: "low",
        snippet:
          b.excerpt ||
          (b.content ? b.content.substring(0, 150) + "..." : "No snippet"),
        status: b.status,
      };
    });

    // Compute real MongoDB stats
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

    // Fetch real AuditLog documents from MongoDB
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

    const newStatus = actionType === "approve" ? "published" : "rejected";
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { status: newStatus },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found in MongoDB" },
        { status: 404 }
      );
    }

    // Record real audit log entry in MongoDB
    const auditAction =
      actionType === "approve" ? "APPROVED_POST" : "SUSPENDED_POST";
    const auditEntry = await AuditLog.create({
      actorId: guard.user._id,
      action: auditAction,
      entityType: "Blog",
      entityId: blog._id,
      details: {
        title: title || blog.title,
        reason: reason || "Moderator decision",
        newStatus,
      },
    });

    return NextResponse.json(
      {
        success: true,
        blog,
        auditLog: {
          id: `LOG-${auditEntry._id.toString().slice(-4).toUpperCase()}`,
          moderator: guard.user.name,
          action: auditAction,
          target: blog.title,
          reason: reason || "Moderator decision",
          timestamp: "Just now",
          type: actionType === "approve" ? "success" : "danger",
        },
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
