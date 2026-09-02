import { Blog } from "./blog.model.js";

export class BlogRepository {
  async create(data) {
    return await Blog.create(data);
  }

  async findById(blogId) {
    return await Blog.findById(blogId).populate(
      "authorId",
      "name email avatar"
    );
  }

  async findBySlugAndTenant(slug, tenantId) {
    return await Blog.findOne({ slug, tenantId }).populate(
      "authorId",
      "name email avatar"
    );
  }

  async findByTenant(tenantId, query = {}, skip = 0, limit = 10) {
    return await Blog.find({ tenantId, ...query })
      .populate("authorId", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async update(blogId, updateData) {
    return await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
  }

  async delete(blogId) {
    return await Blog.findByIdAndDelete(blogId);
  }
}
