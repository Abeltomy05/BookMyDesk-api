import { Types } from "mongoose";

// vendor home data 
export interface PopulatedBooking {
  _id: Types.ObjectId;
   bookingDate: Date;
   status: string;
  clientId?: {
    _id: Types.ObjectId;
    username: string;
    email: string;
    phone: string;
  } | string;
  vendorId: Types.ObjectId;
  spaceId?: {
    _id: Types.ObjectId;
    name: string;
    pricePerDay: number;
  } | string;
  buildingId?: {
    _id: Types.ObjectId;
    buildingName: string;
     location?: {
      type?: string;
      name?: string;
      displayName?: string;
      zipCode?: string;
      coordinates?: number[];
    };
  } | string;
  createdAt?: Date;
  updatedAt?: Date;
}