import { Schema } from "mongoose";
import { IBookingModel } from "../models/booking.model";

export const bookingSchema = new Schema<IBookingModel>(
  {
    spaceId:   { type: Schema.Types.ObjectId, ref: "Space", required: true },
    clientId:   { type: Schema.Types.ObjectId, ref: "Client", required: true },
    vendorId:   { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    buildingId:   { type: Schema.Types.ObjectId, ref: "Building", required: true },

    bookingDate:   { type: Date, required: true },
    numberOfDesks:  { type: Number },
    totalPrice:     { type: Number},

    status:  { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
    paymentStatus:  { type: String, enum: ['unpaid', 'pending', 'succeeded', 'failed', 'refunded'], default: "unpaid" },
    paymentMethod:  { type: String, enum: ["stripe", "wallet"] },

    transactionId:  { type: String,},
  },
  { timestamps: true }
);