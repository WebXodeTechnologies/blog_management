import { Tenant } from "./tenant.model.js";

export class TenantRepository {
  async create(data) {
    return await Tenant.create(data);
  }

  async findById(tenantId) {
    return await Tenant.findById(tenantId);
  }

  async findBySlug(slug) {
    return await Tenant.findOne({ slug });
  }

  async findByDomain(domain) {
    return await Tenant.findOne({ domain });
  }

  async update(tenantId, updateData) {
    return await Tenant.findByIdAndUpdate(tenantId, updateData, { new: true });
  }
}
