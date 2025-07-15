import { Schema } from "mongoose";
import { IChatSessionModel } from "../models/chatSession.model";

export const chatSessionSchema = new Schema<IChatSessionModel>(
  {
    clientId:   { type: Schema.Types.ObjectId, ref: "Client", required: true },
    buildingId:   { type: Schema.Types.ObjectId, ref: "Building", required: true },

    lastMessage: {type: String},
    lastMessageAt: {type: Date},

    clearedAtBy: { type: Map, of: Date, default:{} },
  },
  { timestamps: true }
);