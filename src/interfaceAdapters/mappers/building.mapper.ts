import { IBuildingEntity } from "../../entities/models/building.entity";
import { IBuildingModel } from "../../frameworks/database/mongo/models/building.model";
import { Types } from "mongoose";
const { ObjectId } = Types;

export const toEntityBuilding = (model: IBuildingModel): IBuildingEntity => ({
   ...model,
   _id: model._id.toString(),
  vendorId: model.vendorId.toString(),
});

export const toModelBuilding = (entity: IBuildingEntity): Partial<IBuildingModel> => {
  const modelData: Partial<IBuildingModel> = {
    buildingName: entity.buildingName,
    location: entity.location,
    email: entity.email,
    phone: entity.phone,
    description: entity.description,
    amenities: entity.amenities,
    images: entity.images,
    openingHours: entity.openingHours,
    status: entity.status,
    summarizedSpaces: entity.summarizedSpaces,
    vendorId: new Types.ObjectId(entity.vendorId),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };

  if (entity._id) {
    modelData._id = new Types.ObjectId(entity._id);
  }

  return modelData;
};