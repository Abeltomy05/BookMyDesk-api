import { Document, model, Types } from "mongoose";
import { chatMessageSchema } from "../schemas/chatMessage.schema";
import { IChatMessageEntity } from "../../../../entities/models/chatMessage.entity";

export interface IChatMessageModel extends Omit<IChatMessageEntity, "_id" | "senderId" | "receiverId" | "sessionId">,Document{
    _id: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    sessionId: Types.ObjectId;
}

export const ChatMessageModel = model<IChatMessageModel>("ChatMessage", chatMessageSchema);