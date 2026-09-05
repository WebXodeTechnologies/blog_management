import { Comment } from "./comment.model";

export class CommentRepository {
  async findByBlogId(blogId) {
    return await Comment.find({ blogId, status: "published" })
      .populate("userId", "name email avatar seniorityLevel")
      .sort({ createdAt: 1 });
  }

  async create(commentData) {
    const comment = await Comment.create(commentData);
    return await comment.populate("userId", "name email avatar seniorityLevel");
  }

  async updateStatus(commentId, status) {
    return await Comment.findByIdAndUpdate(
      commentId,
      { status },
      { new: true }
    );
  }

  async deleteById(commentId) {
    return await Comment.findByIdAndDelete(commentId);
  }
}
