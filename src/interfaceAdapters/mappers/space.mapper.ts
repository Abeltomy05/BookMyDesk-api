import { ISpaceEntity } from "../../entities/models/space.entity";
import { ISpaceModel } from "../../frameworks/database/mongo/models/space.model";
import { Types } from "mongoose";

export const toEntitySpace = (model: ISpaceModel): ISpaceEntity => {
  const obj = typeof model.toObject === "function" ? model.toObject() : model;

  return {
    _id: obj._id.toString(),
    buildingId: obj.buildingId.toString(),
    name: obj.name,
    capacity: obj.capacity,
    isAvailable: obj.isAvailable,
    pricePerDay: obj.pricePerDay,
    amenities: obj.amenities,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

export const toModelSpace = (entity: ISpaceEntity): Partial<ISpaceModel> => {
  const modelData: Partial<ISpaceModel> = {
    buildingId: new Types.ObjectId(entity.buildingId),
    name: entity.name,
    description: entity.description,
    capacity: entity.capacity,
    pricePerDay: entity.pricePerDay,
    amenities: entity.amenities,
    isAvailable: entity.isAvailable,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };

  if (entity._id) {
    modelData._id = new Types.ObjectId(entity._id);
  }

  return modelData;
};