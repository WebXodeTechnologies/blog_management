import { CategoryRepository } from "./category.repository.js";
import slugify from "slugify";

export class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(tenantId, payload) {
    const baseSlug = slugify(payload.name, { lower: true, strict: true });
    let slug = baseSlug;

    let existing = await this.categoryRepository.findBySlugAndTenant(
      slug,
      tenantId
    );
    let counter = 1;
    while (existing) {
      slug = `${baseSlug}-${counter}`;
      existing = await this.categoryRepository.findBySlugAndTenant(
        slug,
        tenantId
      );
      counter++;
    }

    return await this.categoryRepository.create({
      ...payload,
      slug,
      tenantId: payload.isGlobal ? null : tenantId,
    });
  }

  async getTenantCategories(tenantId) {
    return await this.categoryRepository.findByTenant(tenantId);
  }

  async updateCategory(categoryId, updateData) {
    if (updateData.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true });
    }
    const updated = await this.categoryRepository.update(
      categoryId,
      updateData
    );
    if (!updated) {
      throw new Error("Category not found or update failed");
    }
    return updated;
  }

  async deleteCategory(categoryId) {
    const deleted = await this.categoryRepository.delete(categoryId);
    if (!deleted) {
      throw new Error("Category not found or delete failed");
    }
    return deleted;
  }
}
