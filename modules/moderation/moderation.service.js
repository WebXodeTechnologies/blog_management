import { ModerationRepository } from "./moderation.repo";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";

export class ModerationService {
  constructor() {
    this.moderationRepo = new ModerationRepository();
  }

  async getPendingQueue() {
    const pendingBlogs = await this.moderationRepo.findPendingBlogs();
    return pendingBlogs.map((b) => ({
      id: `SUB-${b._id.toString().slice(-4).toUpperCase()}`,
      rawId: b._id.toString(),
      title: b.title,
      slug: b.slug,
      content: b.content,
      category: b.categoryId?.name || "General",
      tenantId: b.tenantId?.slug || b.tenantId?.name || "general",
      author: {
        id: b.authorId?._id?.toString() || "",
        name: b.authorId?.name || "Anonymous Dev",
        email: b.authorId?.email || "",
        avatar: b.authorId?.avatar || "",
        seniorityLevel: b.authorId?.seniorityLevel || "tech_enthusiast",
        yearsOfExperience: b.authorId?.yearsOfExperience || 0,
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
    }));
  }

  async processModerationAction(blogId, actionType, reason, title, actor) {
    const newStatus = actionType === "approve" ? "published" : "rejected";
    const blog = await this.moderationRepo.updateBlogStatus(blogId, newStatus);
    if (!blog) throw new Error("Blog post not found in MongoDB");

    const auditAction =
      actionType === "approve" ? "APPROVED_POST" : "SUSPENDED_POST";
    const auditEntry = await AuditLog.create({
      actorId: actor._id,
      action: auditAction,
      entityType: "Blog",
      entityId: blog._id,
      details: {
        title: title || blog.title,
        reason: reason || "Moderator decision",
        newStatus,
      },
    });

    return {
      blog,
      auditLog: {
        id: `LOG-${auditEntry._id.toString().slice(-4).toUpperCase()}`,
        moderator: actor.name,
        action: auditAction,
        target: blog.title,
        reason: reason || "Moderator decision",
        timestamp: "Just now",
        type: actionType === "approve" ? "success" : "danger",
      },
    };
  }
}
