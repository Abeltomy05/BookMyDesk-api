import { inject, injectable } from "tsyringe";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { ISpaceEntity } from "../../entities/models/space.entity";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { toEntitySpace, toModelSpace } from "../../interfaceAdapters/mappers/space.mapper";
import { toEntityBuilding } from "../../interfaceAdapters/mappers/building.mapper";
import { IEditBuildingUsecase } from "../../entities/usecaseInterfaces/building/edit-building-usecase.interface";
import mongoose from "mongoose";
import { SpaceAggregation } from "../../shared/dtos/types/user.types";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class EditBuildingUsecase implements IEditBuildingUsecase{
    constructor(
    @inject("IBuildingRepository")
    private buildingRepository: IBuildingRepository,
    @inject("ISpaceRepository")
    private spaceRepository: ISpaceRepository,
    ){}

    async execute(
    buildingDataToUpdate: Partial<Omit<IBuildingEntity, "vendorId" | "status" | "createdAt" | "updatedAt" | "summarizedSpaces">> & { id: string },
    spaceList: ISpaceEntity[]
    ): Promise<IBuildingEntity>{
         const existingBuilding = await this.buildingRepository.findOne({_id:buildingDataToUpdate.id});  
          if (!existingBuilding) {
            throw new CustomError(ERROR_MESSAGES.BUILDING_NOT_FOUND,StatusCodes.NOT_FOUND);
            }    

      const { id, ...updateData } = buildingDataToUpdate;
      let updatedBuilding = await this.buildingRepository.update({_id: id}, updateData);
       if (!updatedBuilding) {
        throw new CustomError(ERROR_MESSAGES.FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
        }

      const existingSpaces = await this.spaceRepository.find({ buildingId: updatedBuilding._id });

      const updatedSpaceIds = new Set<string>();
      const updatedSpaces: ISpaceEntity[] = [];

      for (const space of spaceList) {
        const isNew = !space._id || !mongoose.Types.ObjectId.isValid(space._id);
        if (isNew) {
        delete space._id;
        }
        
         let savedSpace;
        if (!isNew) {
            const existingSpace = await this.spaceRepository.findOne({ _id: space._id });
            if (existingSpace) {
            savedSpace = await this.spaceRepository.update(
                { _id: existingSpace._id },
                toModelSpace({ ...space, buildingId: updatedBuilding._id.toString() })
            );
            }
        }

        if (!savedSpace) {
            savedSpace = await this.spaceRepository.save(
            toModelSpace({ ...space, buildingId: updatedBuilding._id.toString() })
            );
        }

         updatedSpaceIds.add(savedSpace._id.toString());
         updatedSpaces.push(toEntitySpace(savedSpace));
      }

      //deleting space which is not in list but already in db
     const spacesToDelete = existingSpaces.filter(s => !updatedSpaceIds.has(s._id.toString()));
      for (const space of spacesToDelete) {
            await this.spaceRepository.delete({ _id: space._id });
        }

      const summaryMap: Record<string, SpaceAggregation> = {};
      for (const space of updatedSpaces) {
        const { name, capacity = 0, pricePerDay = 0 } = space;

        if (summaryMap[name]) {
            summaryMap[name].count += capacity;
            summaryMap[name].price = Math.min(summaryMap[name].price, pricePerDay);
        } else {
            summaryMap[name] = {
            count: capacity,
            price: pricePerDay
            };
        }
        }

        const summarizedSpaces = Object.entries(summaryMap).map(([name, { count, price }]) => ({
            name,
            count,
            price
            }));

        updatedBuilding = await this.buildingRepository.update(
            { _id: id },
            { ...updateData, summarizedSpaces }
        );  

        if (!updatedBuilding) {
            throw new CustomError(ERROR_MESSAGES.FAILED_UPDATE_SUMMARIZED_SPACE_BUILDING, StatusCodes.INTERNAL_SERVER_ERROR);
        }

       return toEntityBuilding(updatedBuilding);

    }
}