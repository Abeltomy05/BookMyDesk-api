import { inject, injectable } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { IGetReApplyBuildingData } from "../../entities/usecaseInterfaces/building/reapply-building-usecase.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { ISpaceEntity } from "../../entities/models/space.entity";
import { ERROR_MESSAGES } from "../../shared/constants";

export type BuildingAndSpaceResult = {
  building: Partial<IBuildingEntity>;
  spaces: Partial<ISpaceEntity>[] | null;
};

@injectable()
export class GetReApplyBuildingData implements IGetReApplyBuildingData{
    constructor(
      @inject("IJwtService")
      private _tokenService: IJwtService,
      @inject("IBuildingRepository")
      private _buildingRepo: IBuildingRepository,
      @inject("ISpaceRepository")
      private _spaceRepo: ISpaceRepository,
    ){}

    async execute(token: string):Promise<BuildingAndSpaceResult>{
       const payload = this._tokenService.verifyResetToken(token);
       if (!payload || !payload.value) {
            throw new CustomError(ERROR_MESSAGES.INVALID_TOKEN, StatusCodes.BAD_REQUEST);
        }
        const BuildingProjection = [
            "_id", "buildingName", "location", "openingHours", "phone", "email", "images", "amenities", "status", "createdAt"
        ]
        const building = await this._buildingRepo.findOne({_id:payload.value}, BuildingProjection);
        if(!building){
            throw new CustomError(ERROR_MESSAGES.BUILDING_NOT_FOUND,StatusCodes.NOT_FOUND);
        }

        const SpaceProjection = [
            "_id","name","capacity","pricePerDay","amenities","isAvailable"
        ]
        const spaces = await this._spaceRepo.find({buildingId:payload.value},SpaceProjection)
        const transformedSpaces = spaces.map(space => ({
           ...space,
           _id: space._id?.toString(),
           buildingId: space.buildingId?.toString(),
        }));
        return{
           building:{
            _id:building._id.toString(),
            buildingName: building.buildingName,
            location: building.location,
            openingHours: building.openingHours,
            phone: building.phone,
            email: building.email,
            amenities: building.amenities,
            images: building.images,
            status: building.status,
            createdAt: building.createdAt
           },
           spaces:transformedSpaces
        }

    }
}