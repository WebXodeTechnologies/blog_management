import { UserRepository } from "./user.repo";

export class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getUserProfile(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateProfile(userId, updateData) {
    // Prevent direct role or security updates through regular profile endpoints
    delete updateData.password;
    delete updateData.role;

    const updated = await this.userRepo.updateById(userId, updateData);
    if (!updated) throw new Error("Failed to update user profile");
    return updated;
  }

  async adminUpdateUser(userId, adminData) {
    const updated = await this.userRepo.updateById(userId, adminData);
    if (!updated) throw new Error("User not found or update failed");
    return updated;
  }

  async listUsers(query = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await this.userRepo.findWithPagination(query, skip, limit);
  }
}
