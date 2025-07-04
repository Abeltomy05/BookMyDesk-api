import { Schema } from "mongoose";
import { IOfferModel } from "../models/offer.model";

export const offerSchema = new Schema<IOfferModel>(
  {
    spaceId:   { type: Schema.Types.ObjectId, ref: "Space", required: true },
    vendorId:   { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    buildingId:   { type: Schema.Types.ObjectId, ref: "Building", required: true },

    discountPercentage:   { type: Number, required: true, min: 1, max: 100 },
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);