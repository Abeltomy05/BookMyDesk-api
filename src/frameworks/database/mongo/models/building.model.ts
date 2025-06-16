import { Document, model, Types } from 'mongoose';
import { buildingSchema } from '../schemas/building.schema';
import { IBuildingEntity } from '../../../../entities/models/building.entity';

export interface IBuildingModel extends Omit<IBuildingEntity, "vendorId" | "location" | "_id">, Document {
    _id: Types.ObjectId;
    vendorId: Types.ObjectId;
    location?: {
    type?: string;
    name?: string;
    displayName?: string;
    zipCode?: string;
    coordinates?: number[];
  };
}

export const BuildingModel = model<IBuildingModel>('Building', buildingSchema);
