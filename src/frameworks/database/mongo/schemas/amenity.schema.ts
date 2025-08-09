import { Schema } from "mongoose";
import { IAmenityModel } from "../models/amenity.model";

export const amenitySchema = new Schema<IAmenityModel>(
  {
    name:  { type: String, required: true, unique: true  },
    status: { type: String, required: true, enum: ['active', 'non-active', 'pending', 'rejected'], default:'active'},
    description: {type: String},
    requestedBy: { type: Schema.Types.ObjectId, ref: "Vendor" },
  },
  { timestamps: true }
);