import { NotificationRepository } from "./notification.repository";

export class NotificationService {
  constructor() {
    this.notificationRepo = new NotificationRepository();
  }

  async getUserNotifications(userId) {
    return await this.notificationRepo.findByRecipientId(userId);
  }

  async createAndEmitNotification(io, data) {
    const notification = await this.notificationRepo.create(data);

    if (io) {
      io.to(`user_${data.recipientId}`).emit(
        "receive_notification",
        notification
      );
    }

    return notification;
  }

  async markAsRead(notificationId, userId) {
    return await this.notificationRepo.markAsRead(notificationId, userId);
  }
}
