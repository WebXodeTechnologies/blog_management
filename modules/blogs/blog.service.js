import { BlogRepository } from "./blog.repository.js";
import slugify from "slugify";

export class BlogService {
  constructor() {
    this.blogRepository = new BlogRepository();
  }

  async createBlog(authorId, tenantId, payload) {
    const baseSlug = slugify(payload.title, { lower: true, strict: true });
    let slug = baseSlug;

    // Ensure unique slug per tenant
    let existing = await this.blogRepository.findBySlugAndTenant(
      slug,
      tenantId
    );
    let counter = 1;
    while (existing) {
      slug = `${baseSlug}-${counter}`;
      existing = await this.blogRepository.findBySlugAndTenant(slug, tenantId);
      counter++;
    }

    return await this.blogRepository.create({
      ...payload,
      slug,
      authorId,
      tenantId,
    });
  }

  async getBlogBySlug(slug, tenantId) {
    const blog = await this.blogRepository.findBySlugAndTenant(slug, tenantId);
    if (!blog) {
      throw new Error("Blog post not found");
    }
    return blog;
  }

  async getTenantBlogs(tenantId, query) {
    return await this.blogRepository.findByTenant(tenantId, query);
  }

  async updateBlog(blogId, tenantId, updateData) {
    if (updateData.title) {
      const baseSlug = slugify(updateData.title, {
        lower: true,
        strict: true,
      });
      let slug = baseSlug;

      // Ensure unique slug per tenant excluding the current blog being edited
      let existing = await this.blogRepository.findBySlugAndTenant(
        slug,
        tenantId
      );
      let counter = 1;

      while (existing && existing._id.toString() !== blogId) {
        slug = `${baseSlug}-${counter}`;
        existing = await this.blogRepository.findBySlugAndTenant(
          slug,
          tenantId
        );
        counter++;
      }

      updateData.slug = slug;
    }

    const updated = await this.blogRepository.update(blogId, updateData);
    if (!updated) {
      throw new Error("Blog post not found or update failed");
    }
    return updated;
  }

  async deleteBlog(blogId) {
    const deleted = await this.blogRepository.delete(blogId);
    if (!deleted) {
      throw new Error("Blog post not found or delete failed");
    }
    return deleted;
  }
}
