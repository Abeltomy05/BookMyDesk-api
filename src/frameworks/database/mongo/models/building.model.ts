import { Document, model, ObjectId } from 'mongoose';
import { buildingSchema } from '../schemas/building.schema';
import { IBuildingEntity } from '../../../../entities/models/building.entity';

export interface IBuildingModel extends Omit<IBuildingEntity, "vendorId">, Document {
    _id: ObjectId;
    vendorId: ObjectId;
}

export const BuildingModel = model<IBuildingModel>('Building', buildingSchema);
