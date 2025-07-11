import { Document, model, Types } from "mongoose";
import { chatSessionSchema } from "../schemas/chatSession.schema";
import { IChatSessionEntity } from "../../../../entities/models/chatSession.entity";

export interface IChatSessionModel extends Omit<IChatSessionEntity, "_id" | "clientId" | "vendorId" | "bookingId">,Document{
    _id: Types.ObjectId;
    clientId: Types.ObjectId;
    vendorId: Types.ObjectId;
    bookingId: Types.ObjectId;
}

export const ChatSessionModel = model<IChatSessionModel>("ChatSession", chatSessionSchema);