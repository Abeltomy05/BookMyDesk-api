import { Schema } from "mongoose";
import { IChatMessageModel } from "../models/chatMessage.model";

export const chatMessageSchema = new Schema<IChatMessageModel>(
  {
    senderId:   { type: Schema.Types.ObjectId, refPath: "senderModel", required: true },
    senderModel: { type: String, required: true, enum: ['Client', 'Vendor'] },

    receiverId:   { type: Schema.Types.ObjectId, refPath: "receiverModel", required: true },
    receiverModel: { type: String, required: true, enum: ['Client', 'Vendor'] },

    roomId:   { type: Schema.Types.ObjectId, ref: "ChatSession", required: true },

    type: {type: String, enum: ['text','image','file','video','audio'], required: true },
    content: {type: String, required: true },

    isDeletedFor: [{ type: String, enum: ['client', 'vendor'] }],
    readBy: [{ type: String, enum: ['client', 'vendor'] }],
  },
  { timestamps: true }
);