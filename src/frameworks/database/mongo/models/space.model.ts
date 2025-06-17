import { Document, model, Types } from 'mongoose';
import { spaceSchema } from '../schemas/space.schema';
import { ISpaceEntity } from '../../../../entities/models/space.entity';

export interface ISpaceModel extends Omit<ISpaceEntity, "buildingId" | "_id">, Document {
    _id: Types.ObjectId;
    buildingId: Types.ObjectId;
}

export const SpaceModel = model<ISpaceModel>('Space', spaceSchema);
