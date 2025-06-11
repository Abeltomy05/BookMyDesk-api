import { Document, model, ObjectId } from 'mongoose';
import { spaceSchema } from '../schemas/space.schema';
import { ISpaceEntity } from '../../../../entities/models/space.entity';

export interface ISpaceModel extends Omit<ISpaceEntity, "buildingId">, Document {
    _id: ObjectId;
    buildingId: ObjectId;
}

export const spaceModel = model<ISpaceModel>('Space', spaceSchema);
