import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";
import { messaging } from "../../shared/config/firebaseAdmin";
import { INotificationService } from "../../entities/serviceInterfaces/notification-service.interface";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { Types } from "mongoose";
import { NotificationSocketHandler } from "../../shared/config/notificationSocket";
import { INotificationSocketHandler } from "../../entities/socketInterfaces/notification-socket-handler.interface";
import { getNotificationSocketHandler } from "../../shared/config/setupNotificationSocket";
import { getChatSocketHandler } from "../../shared/config/setupChatSocket";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
     @inject("IClientRepository")
     private _clientRepo: IClientRepository,
     @inject("IVendorRepository")
     private _vendorRepo: IVendorRepository,
     @inject("IAdminRepository")
     private _adminRepo: IAdminRepository,
     @inject("INotificationRepository")
     private _notificationRepository: INotificationRepository,
  ){}

  async sendToUser(
    userId:string,
    role:string,
    title:string,
    body:string,
    data?: Record<string, string>
  ){
    let repo;

    if (role === "client") repo = this._clientRepo;
    else if (role === "vendor") repo = this._vendorRepo;
    else if (role === "admin") repo = this._adminRepo;
    else throw new Error("Invalid user role for notification");

    const user = await repo.findOne({ _id: userId });

    if (!user?.fcmToken) {
      console.warn(`No FCM token found for ${role} with ID ${userId}`);
      return;
    }

    const message = {
      token: user.fcmToken,
      notification: { title, body },
      data: data || {},
    };

    try {
      await messaging.send(message);
      console.log(`✅ Notification sent to ${role} (${userId})`);
      
       const notificationSocketHandler = getNotificationSocketHandler();
       const chatSocketHandler = getChatSocketHandler();
       notificationSocketHandler.emitNotification(userId);
       chatSocketHandler.emitNotification(userId);
    } catch (error) {
      const err = error as { code?: string; message?: string };

      console.error(
        `❌ Error sending notification to ${role} (${userId}):`,
        err.code ?? "unknown_code",
        err.message ?? "unknown_message"
      );

      if (
        err.code === "messaging/invalid-registration-token" ||
        err.code === "messaging/registration-token-not-registered"
      ) {
        await repo.update({ _id: userId }, { fcmToken: "" });
        console.warn(`🧹 Cleaned up invalid FCM token for ${role} (${userId})`);
      }
    }
  }

  async saveNotification(
    userId:string,
    role:string,
    title: string,
    body: string,
    metaData: object,
  ){
     await this._notificationRepository.save({
      userId: new Types.ObjectId(userId),
      role,
      title,
      body,
      isRead: false,
      metaData,
     })
  }
}