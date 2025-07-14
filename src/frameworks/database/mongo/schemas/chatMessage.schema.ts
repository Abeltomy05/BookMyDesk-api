import { Schema } from "mongoose";
import { IChatMessageModel } from "../models/chatMessage.model";

export const chatMessageSchema = new Schema<IChatMessageModel>(
  {
    senderId:   { type: Schema.Types.ObjectId, refPath: "senderModel", required: true },
    senderModel: { type: String, required: true, enum: ['Client', 'Building'] },

    receiverId:   { type: Schema.Types.ObjectId, refPath: "receiverModel", required: true },
    receiverModel: { type: String, required: true, enum: ['Client', 'Building'] },

    sessionId:   { type: Schema.Types.ObjectId, ref: "ChatSession", required: true },

    text: { type: String },
    image: { type: String, },

    isDeletedFor: [{ type: String, enum: ['client', 'vendor'] }],
  },
  { timestamps: true }
);