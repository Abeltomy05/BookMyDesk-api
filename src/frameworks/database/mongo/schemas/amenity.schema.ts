import { Schema } from "mongoose";
import { IAmenityModel } from "../models/amenity.model";

export const amenitySchema = new Schema<IAmenityModel>(
  {
    name:  { type: String, required: true, unique: true  },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);