import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { Building } from "../../shared/dtos/building.dto";
import { IRetryBuildingRegistrationUseCase } from "../../entities/usecaseInterfaces/building/retry-building-registration-usecase.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { Types } from "mongoose";
import { isValidObjectId } from "../../shared/helper/isValidObjectId";

@injectable()
export class RetryBuildingRegistrationUseCase implements IRetryBuildingRegistrationUseCase{
    constructor(
      @inject("IBuildingRepository")
      private _buildingRepo: IBuildingRepository,
      @inject("ISpaceRepository")
      private _spaceRepo: ISpaceRepository,
    ){}

 async execute(building: Partial<Building>): Promise<void> {
        if (!building._id) {
            throw new CustomError("Building ID is required", StatusCodes.BAD_REQUEST);
        }
       
        const existingBuilding = await this._buildingRepo.findOne({_id: building._id});

        if (!existingBuilding) {
            throw new CustomError("Building not found.", StatusCodes.NOT_FOUND);
        }

        const { spaces, createdAt, ...buildingData } = building;

        const updatedBuilding = await this._buildingRepo.update(
            { _id: building._id },
            {
                ...buildingData,
                status: 'pending',
            }
        );

        if (!updatedBuilding) {
            throw new CustomError("Failed to reapply building.", StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (spaces && spaces.length > 0) {
            const buildingObjectId = new Types.ObjectId(building._id);
            const existingSpaces = await this._spaceRepo.find({ buildingId: buildingObjectId });

            const incomingSpaceIds = spaces
            .filter(space => space._id && isValidObjectId(space._id))
            .map(space => space._id!.toString());

            const spacesToDelete = existingSpaces.filter(space => {
              return !incomingSpaceIds.includes(space._id.toString());
            });

            for (const space of spacesToDelete) {
                await this._spaceRepo.delete({ _id: space._id });
            }
            
            for (const space of spaces) {
                 try {
                     let isUpdated = false;
                       
                  if (space._id && isValidObjectId(space._id)) {
                    console.log(`Updating existing space with ID: ${space._id}`);

                    const existingSpace = await this._spaceRepo.findOne({ _id: space._id });
                    
                    if (existingSpace) {
                        const { _id, ...updateData } = space;
                        
                        const updatedSpace = await this._spaceRepo.update(
                            { _id: space._id },
                            {
                                ...updateData,
                                buildingId: buildingObjectId,
                            }
                        );
                        
                        if (updatedSpace) {
                        console.log(`Successfully updated space: ${space._id}`);
                        isUpdated = true;
                        } else {
                        console.error(`Failed to update space with ID: ${space._id}`);
                        }
                    } else {
                        console.log(`No existing space found with ID ${space._id}, will create new.`);
                    }
                } 

                if (!isUpdated) {
                     const { _id, ...newSpaceData } = space;
                     console.log(`Creating new space: ${space.name}`);
                        const newSpace = await this._spaceRepo.save({
                            ...newSpaceData,
                            buildingId: buildingObjectId,
                        });

                    if (newSpace) {
                        console.log(`Successfully created new space: ${newSpace._id}`);
                    } else {
                        console.error(`Failed to create new space: ${space.name}`);
                    }    

                }
               } catch (err:unknown) {
               console.error(`Error processing space "${space.name}":`, err);

                let errorMessage = 'Unknown error';
                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                } else if (typeof err === 'object' && err !== null && 'message' in err) {
                    errorMessage = String((err as any).message);
                }

                throw new CustomError(
                    `Failed to process space "${space.name}": ${errorMessage}`,
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
               }  
            }
        }
    }

}