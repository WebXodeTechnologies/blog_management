import { Membership } from "./membership.model.js";

export class MembershipRepository {
  async create(data) {
    return await Membership.create(data);
  }

  async findByUserAndTenant(userId, tenantId) {
    return await Membership.findOne({ userId, tenantId });
  }

  async findByTenant(tenantId) {
    return await Membership.find({ tenantId }).populate(
      "userId",
      "name email avatar"
    );
  }

  async updateRole(userId, tenantId, role) {
    return await Membership.findOneAndUpdate(
      { userId, tenantId },
      { role },
      { new: true }
    );
  }

  async remove(userId, tenantId) {
    return await Membership.findOneAndDelete({ userId, tenantId });
  }
}
