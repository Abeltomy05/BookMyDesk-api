import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { Types } from "mongoose";
import { IGetBuildingsForVerification } from "../../entities/usecaseInterfaces/building/get-building-varification-usecase.interface";

@injectable()
export class GetBuildingsForVerification implements IGetBuildingsForVerification{
    constructor(
       @inject("IBuildingRepository")
       private _buildingRepository:IBuildingRepository
    ){}

    async execute(
        page: number,
        limit: number,
        status:string,
    ): Promise<{ buildings: IBuildingEntity[]; totalPages: number; currentPage: number }>{
        const filterCriteria: any = {};

        if (status && status !== "all") {
        filterCriteria.status = status; 
        }

        const skip = (page - 1) * limit;
       const totalCount = await this._buildingRepository.countDocuments(filterCriteria);
       const totalPages = Math.ceil(totalCount / limit); 
          
      const { items: rawBuildings } = await this._buildingRepository.findAndPopulate(
        filterCriteria,
        skip,
        limit,
        { createdAt: -1 },
        [
            { path: "vendorId", select: "username email" } 
        ]
        ); 


       const buildings: IBuildingEntity[] = rawBuildings.map((building) => ({
        _id: building._id.toHexString(),
        buildingName: building.buildingName,
        vendorId: typeof building.vendorId === 'object' && '_id' in building.vendorId 
        ? (building.vendorId as any)._id.toString() 
        : building.vendorId?.toString?.(),
        vendorName: building.vendorId.username,
        vendorEmail: building.vendorId.email,
        location: building.location.displayName,
        openingHours: building.openingHours,
        phone: building.phone,
        email: building.email,
        images: building.images,
        amenities: building.amenities,
        summarizedSpaces: building.summarizedSpaces ?? [],
        status: building.status,
        createdAt: building.createdAt,
        updatedAt: building.updatedAt,
        }));

         return {
            buildings,
            totalPages,
            currentPage: page,
            };
    }
}