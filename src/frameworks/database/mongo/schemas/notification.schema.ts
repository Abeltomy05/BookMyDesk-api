import { Schema } from "mongoose";
import { INotificationModel } from "../models/notification.model";

export const notificationSchema = new Schema<INotificationModel>(
  {
    userId:   { type: Schema.Types.ObjectId, refPath: "role", required: true },
    role:   { type: String, enum: ["Client", "Vendor", "Admin"], required: true },
    title:  { type: String, required: true },
    body:  { type: String, required: true },
    isRead:  { type: Boolean },
    metaData: { type: Object }
  },
  { timestamps: true }
);