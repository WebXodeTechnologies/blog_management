import { Category } from "./category.model.js";

export class CategoryRepository {
  async create(data) {
    return await Category.create(data);
  }

  async findById(categoryId) {
    return await Category.findById(categoryId);
  }

  async findBySlugAndTenant(slug, tenantId) {
    return await Category.findOne({
      slug,
      $or: [{ tenantId }, { isGlobal: true }],
    });
  }

  async findByTenant(tenantId) {
    return await Category.find({
      $or: [{ tenantId }, { isGlobal: true }],
    }).sort({ name: 1 });
  }

  async update(categoryId, updateData) {
    return await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
    });
  }

  async delete(categoryId) {
    return await Category.findByIdAndDelete(categoryId);
  }
}
