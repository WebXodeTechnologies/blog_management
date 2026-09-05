import { Moderation } from "./moderation.model";
import { Blog } from "@/modules/blogs/blog.model";

export class ModerationRepository {
  async findPendingBlogs() {
    return await Blog.find({ status: { $in: ["pending", "draft"] } })
      .populate(
        "authorId",
        "name email avatar seniorityLevel yearsOfExperience headline"
      )
      .populate("tenantId", "name slug")
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 });
  }

  async updateBlogStatus(blogId, status) {
    return await Blog.findByIdAndUpdate(blogId, { status }, { new: true });
  }
}
