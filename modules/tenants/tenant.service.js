import { TenantRepository } from "./tenant.repository.js";

export class TenantService {
  constructor() {
    this.tenantRepository = new TenantRepository();
  }

  async createTenant(ownerId, payload) {
    const existing = await this.tenantRepository.findBySlug(payload.slug);
    if (existing) {
      throw new Error("Tenant slug is already taken");
    }

    return await this.tenantRepository.create({
      ...payload,
      ownerId,
    });
  }

  async getTenantBySlug(slug) {
    const tenant = await this.tenantRepository.findBySlug(slug);
    if (!tenant) {
      throw new Error("Tenant workspace not found");
    }
    return tenant;
  }
}
