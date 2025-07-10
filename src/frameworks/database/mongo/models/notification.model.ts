import { Document, model, Types } from "mongoose";
import { notificationSchema } from "../schemas/notification.schema";
import { INotificationEntity } from "../../../../entities/models/notification.entity";

export interface INotificationModel extends Omit<INotificationEntity, "_id" | "userId">,Document{
    _id: Types.ObjectId;
    userId: Types.ObjectId;
}

export const NotificationModel = model<INotificationModel>("Notification", notificationSchema);