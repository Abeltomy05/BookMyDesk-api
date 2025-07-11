import { Schema } from "mongoose";
import { IChatSessionModel } from "../models/chatSession.model";

export const chatSessionSchema = new Schema<IChatSessionModel>(
  {
    clientId:   { type: Schema.Types.ObjectId, ref: "Client", required: true },
    vendorId:   { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    bookingId:   { type: Schema.Types.ObjectId, ref: "Booking", required: true },

    lastMessage: {type: String},
    lastMessageAt: {type: Date},

    isClearedBy: [{ type: String, enum: ['client', 'vendor'] }],
  },
  { timestamps: true }
);