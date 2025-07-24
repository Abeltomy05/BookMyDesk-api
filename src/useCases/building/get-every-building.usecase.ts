import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { FilterQuery } from "mongoose";
import { BuildingStatus } from "../../shared/dtos/types/user.types";
import { EveryBuildingUsecaseResponseDTO } from "../../shared/dtos/building.dto";
import { IGetEveryBuildingUseCase } from "../../entities/usecaseInterfaces/building/every-building-usecase.interface";

@injectable()
export class GetEveryBuildingUseCase implements IGetEveryBuildingUseCase{
    constructor(
      @inject("IBuildingRepository")
      private _buildingRepo: IBuildingRepository
    ){}

    async execute(page:number,limit:number,search:string,status:string): Promise<{items:EveryBuildingUsecaseResponseDTO[]; total:number}> {
         const skip = (page - 1) * limit;
         
         const filter: FilterQuery<IBuildingEntity> = {};
        if (search) {
            filter["$or"] = [
                { buildingName: { $regex: search, $options: "i" } },
                { "location.name": { $regex: search, $options: "i" } }
            ];
        }
        if (status) {
            filter.status = status as BuildingStatus;
        }

         const allBuildings = await this._buildingRepo.findWithPopulate(
            filter,
            [
            {
                path: "vendorId", 
                select: "_id username companyName avatar"
            }
            ]
        ); 

      const total = allBuildings.length;
       const paginated = allBuildings
        .sort((a, b) => (new Date(b.createdAt!).getTime()) - (new Date(a.createdAt!).getTime()))
        .slice(skip, skip + limit);
        
      const items = paginated.map((bld) => ({
        _id: bld._id!.toString(),
        buildingName: bld.buildingName,
        location: { name: bld.location?.name },
        vendor: bld.vendorId as unknown as {
        _id: string;
        username: string;
        companyName: string;
        avatar?: string;
        },
        status: bld.status,
        summarizedSpaces: bld.summarizedSpaces,
        createdAt: bld.createdAt?.toISOString()
    }));
        return { items, total };  
    }
}