import { CommentRepository } from "./comment.repo";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";

export class CommentService {
  constructor() {
    this.commentRepo = new CommentRepository();
  }

  async getBlogComments(blogId) {
    const comments = await this.commentRepo.findByBlogId(blogId);
    return comments.map((c) => ({
      id: c._id.toString(),
      comment: c.comment,
      parentId: c.parentId?.toString() || null,
      createdAt: c.createdAt,
      user: {
        id: c.userId?._id?.toString() || "",
        name: c.userId?.name || "Anonymous Dev",
        avatar: c.userId?.avatar || "",
        seniorityLevel: c.userId?.seniorityLevel || "tech_enthusiast",
      },
    }));
  }

  async addComment(
    blogId,
    userId,
    commentText,
    parentId = null,
    tenantId = null
  ) {
    if (!commentText || !commentText.trim()) {
      throw new Error("Comment text cannot be empty");
    }

    const newComment = await this.commentRepo.create({
      blogId,
      userId,
      comment: commentText.trim(),
      parentId: parentId || null,
      tenantId: tenantId || null,
    });

    return {
      id: newComment._id.toString(),
      comment: newComment.comment,
      parentId: newComment.parentId?.toString() || null,
      createdAt: newComment.createdAt,
      user: {
        id: newComment.userId?._id?.toString() || "",
        name: newComment.userId?.name || "Anonymous Dev",
        avatar: newComment.userId?.avatar || "",
        seniorityLevel: newComment.userId?.seniorityLevel || "tech_enthusiast",
      },
    };
  }

  async moderateComment(commentId, status, actor) {
    const updated = await this.commentRepo.updateStatus(commentId, status);
    if (!updated) throw new Error("Comment not found");

    await AuditLog.create({
      actorId: actor._id,
      action: `COMMENT_${status.toUpperCase()}`,
      entityType: "Comment",
      entityId: commentId,
      details: { newStatus: status },
    });

    return updated;
  }
}
