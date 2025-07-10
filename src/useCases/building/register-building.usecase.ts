import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { Types } from "mongoose";
import { BuildingStatus, SpaceAggregation } from "../../shared/types/types";
import { IRegisterBuildingUsecase } from "../../entities/usecaseInterfaces/building/register-building-usecase.interface";
import { BuildingRegistrationData } from "../../shared/validations/register-building.validation";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { ISpaceEntity } from "../../entities/models/space.entity";
import { INotificationService } from "../../entities/serviceInterfaces/notification-service.interface";



@injectable()
export class RegisterBuildingUsecase implements IRegisterBuildingUsecase{
    constructor(
       @inject("IBuildingRepository")
       private _buildingRepository:IBuildingRepository,
       @inject("ISpaceRepository")
       private _spaceRepository: ISpaceRepository,
       @inject("INotificationService")
       private _notificationService: INotificationService,
    ){}

    async execute(data: BuildingRegistrationData, vendorId: string): Promise<IBuildingEntity>{

       const existingBuilding = await this._buildingRepository.findOne({
          vendorId: new Types.ObjectId(vendorId),
          buildingName: data.name,
          'location.name': data.location?.name || data.location?.displayName,
        });

       
        if (existingBuilding) {
          throw new Error("A building with this name and location already exists.");
        }
 
        
      const cleanedOpeningHours = {
          weekdays: {
            is24Hour: data.openingHours.weekdays.is24Hour,
            ...(data.openingHours.weekdays.is24Hour ? {} : {
              openTime: data.openingHours.weekdays.openTime,
              closeTime: data.openingHours.weekdays.closeTime,
            })
          },
          weekends: {
            is24Hour: data.openingHours.weekends.is24Hour,
            ...(data.openingHours.weekends.is24Hour ? {} : {
              openTime: data.openingHours.weekends.openTime,
              closeTime: data.openingHours.weekends.closeTime,
            })
          }
        };

      const spaceMap: Record<string, SpaceAggregation> = {};
      data.spaceTypes.forEach((space) => {
      if (!space.name) return;

      const existing = spaceMap[space.name];
      const count = space.totalSeats || 0;
      const price = space.pricePerDay || 0;

      if (existing) {
        spaceMap[space.name].count += count;
        spaceMap[space.name].price = Math.min(existing.price, price);
      } else {
        spaceMap[space.name] = {
          count,
          price
        };
      }
    });

      const summarizedSpaces = Object.entries(spaceMap).map(([name, { count, price }]) => ({
        name,
        count,
        price
      }));
  
       const locationData = data.location ? {
        type: data.location.type || "Point",
        name: data.location.name || data.location.displayName,
        displayName: data.location.displayName,
        zipCode: data.location.zipCode,
        coordinates: data.location.coordinates || [0, 0]
      } : {
        type: "Point",
        name: "",
        displayName: "",
        zipCode: "",
        coordinates: [0, 0]
      };

      const newBuilding = await this._buildingRepository.save({
      buildingName: data.name,
      vendorId: new Types.ObjectId(vendorId),
      location: locationData,
      openingHours: cleanedOpeningHours,
      phone: data.phone,
      email: data.email,
      images: data.photos,
      amenities: data.facilities,
      status: "pending",
      summarizedSpaces
    });

    const buildingId = newBuilding._id;

    const spaceEntities: ISpaceEntity[]  = data.spaceTypes.map(space => ({
      buildingId: buildingId.toHexString(),
      name: space.name,
      capacity: space.totalSeats,
      pricePerDay: space.pricePerDay,
      amenities: space.amenities,
      isAvailable: true,
    }));

    await this._spaceRepository.bulkInsert(spaceEntities);

    const adminId = process.env.ADMIN_ID;
    if (!adminId) {
      throw new Error("ADMIN_ID is not defined in environment variables. Please contact support.");
    }
    await this._notificationService.sendToUser(
      adminId,
      'admin',
      'New Building Awaiting Approval!',
      `A new building "${newBuilding.buildingName}" has been registered and is pending your approval.`,
      {
       buildingId: newBuilding._id.toString(),
       buildingName: newBuilding.buildingName,
      }
    );

    await this._notificationService.saveNotification(
      adminId,
      'Admin',
      'New Building Awaiting Approval!',
      `A new building "${newBuilding.buildingName}" has been registered and is pending your approval.`,
      {
       buildingId: newBuilding._id.toString(),
       buildingName: newBuilding.buildingName,
      }
    )

    return {
      buildingName: newBuilding.buildingName,
      vendorId: newBuilding.vendorId.toHexString(),
      location: newBuilding.location,
      openingHours: newBuilding.openingHours,
      phone: newBuilding.phone,
      email: newBuilding.email,
      images: newBuilding.images,
      amenities: newBuilding.amenities,
      status: newBuilding.status as BuildingStatus,
      createdAt: newBuilding.createdAt,
      updatedAt: newBuilding.updatedAt,
      summarizedSpaces: newBuilding.summarizedSpaces
    };
    }
}