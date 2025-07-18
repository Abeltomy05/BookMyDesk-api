import { Schema } from "mongoose";
import { ISpaceModel } from "../models/space.model";

export const spaceSchema = new Schema<ISpaceModel>(
  {
    buildingId:   { type: Schema.Types.ObjectId, ref: "Building", required: true },
    name:         { type: String, required: true, unique:true },
    description:  { type: String },
    capacity:     { type: Number},
    pricePerDay:  { type: Number, required: true },
    amenities:  [{ type: String }],
    isAvailable:  { type: Boolean, default: true },
  },
  { timestamps: true }
);