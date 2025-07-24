import { Schema,Types } from "mongoose";
import { IBuildingModel } from "../models/building.model";

export const buildingSchema = new Schema<IBuildingModel>(
  {
    buildingName:  { type: String, required: true },
    vendorId:     { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      name: { type: String },
      displayName: { type: String },
      zipCode: { type: String },
      coordinates: { type: [Number], default: [0, 0] }
    },
    openingHours: {
       weekdays: {
        is24Hour: { type: Boolean },
        openTime: { type: String },
        closeTime: { type: String }
      },
       weekends: {
        is24Hour: { type: Boolean },
        openTime: { type: String },
        closeTime: { type: String }
      }
                  },
    summarizedSpaces: [
      {
        name: { type: String, required: true },
        count: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],              
    phone: {type: String},
    email: {type: String}, 
    description:  { type: String },             
    images:     [{ type: String }],
    amenities:  [{ type: String }],
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

buildingSchema.index({location: '2dsphere'});