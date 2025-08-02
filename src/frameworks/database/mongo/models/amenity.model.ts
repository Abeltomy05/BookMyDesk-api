import { IAmenityEntity } from "../../../../entities/models/amenity.entity";
import { Document, model, ObjectId } from "mongoose";
import { amenitySchema } from "../schemas/amenity.schema";

export interface IAmenityModel extends Omit<IAmenityEntity, '_id'>,Document{
     _id: ObjectId;
}

export const AmenityModel = model<IAmenityModel>('Amenity', amenitySchema)