import { Document, model, Types } from "mongoose";
import { offerSchema } from "../schemas/offer.schema";
import { IOfferEntity } from "../../../../entities/models/offer.entity";

export interface IOfferModel extends Omit<IOfferEntity, "_id" | "spaceId" | "vendorId" | "buildingId">,Document{
    _id: Types.ObjectId;
    spaceId: Types.ObjectId;
    vendorId: Types.ObjectId;
    buildingId: Types.ObjectId;
}

export const OfferModel = model<IOfferModel>("Offer", offerSchema);