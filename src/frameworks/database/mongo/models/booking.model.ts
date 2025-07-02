import { Document, model, Types } from "mongoose";
import { bookingSchema } from "../schemas/booking.schema";
import { IBookingEntity } from "../../../../entities/models/booking.entity";

export interface IBookingModel extends Omit<IBookingEntity, "_id" | "spaceId" | "clientId" | "vendorId" | "buildingId">,Document{
    _id: Types.ObjectId;
    spaceId: Types.ObjectId;
    clientId: Types.ObjectId;
    vendorId: Types.ObjectId;
    buildingId: Types.ObjectId;
}

export const BookingModel = model<IBookingModel>("Booking", bookingSchema);