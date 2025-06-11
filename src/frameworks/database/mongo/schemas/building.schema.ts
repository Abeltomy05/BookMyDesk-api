import { Schema } from "mongoose";
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
                    name:         { type: String },
                    displayName:  { type: String },
                    zipCode:      { type: String },
                    coordinates:  { type: [Number], default: [0, 0] } 
                },
    openingHours: {
                    type: Map,
                    of: {
                      open: { type: String },
                      close: { type: String },
                      closed: { type: Boolean },
                      is24Hours: { type: Boolean }
                    },
                    default: {}
                  },
    phone: {type: String},
    email: {type: String},              
    images:     [{ type: String }],
    amenities:  [{ type: String }],
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);