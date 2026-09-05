import { Notification } from "./notification.model";

export class NotificationRepository {
  async findByRecipientId(userId, limit = 30) {
    return await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async create(data) {
    return await Notification.create(data);
  }

  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { read: true },
      { new: true }
    );
  }
}
