import { User } from "./user.model";

export class UserRepository {
  async findById(id) {
    return await User.findById(id).select("-password");
  }

  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    if (includePassword) query.select("+password");
    return await query;
  }

  async findWithPagination(filter = {}, skip = 0, limit = 20) {
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await User.countDocuments(filter);
    return { users, total };
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }
}
