import { MembershipRepository } from "./membership.repository.js";

export class MembershipService {
  constructor() {
    this.membershipRepository = new MembershipRepository();
  }

  async addMember(userId, tenantId, role = "MEMBER") {
    const existing = await this.membershipRepository.findByUserAndTenant(
      userId,
      tenantId
    );
    if (existing) {
      throw new Error("User is already a member of this tenant");
    }
    return await this.membershipRepository.create({ userId, tenantId, role });
  }

  async getTenantMembers(tenantId) {
    return await this.membershipRepository.findByTenant(tenantId);
  }

  async verifyMembership(userId, tenantId) {
    const membership = await this.membershipRepository.findByUserAndTenant(
      userId,
      tenantId
    );
    if (!membership || membership.status !== "active") {
      throw new Error("Active membership not found for this tenant");
    }
    return membership;
  }
}
