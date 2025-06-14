import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IBuildingEntity } from "../../entities/models/building.entity";
import {Types } from "mongoose";
import { IGetAllBuildingsUsecase } from "../../entities/usecaseInterfaces/building/get-all-building-usecase.interface";

@injectable()
export class GetAllBuildingsUsecase implements IGetAllBuildingsUsecase{
    constructor(
       @inject("IBuildingRepository")
       private _buildingRepository:IBuildingRepository
    ){}

    async execute(
        page: number,
        limit: number,
        search: string,
        status?: string
    ): Promise<{ buildings: IBuildingEntity[]; totalPages: number }>{
        const filterCriteria: any = {};
         if (search && search.trim() !== '') {
                filterCriteria.$or = [
                    { buildingName: { $regex: search.trim(), $options: 'i' } },
                    { "location.name": { $regex: search.trim(), $options: 'i' } },
                    { description: { $regex: search.trim(), $options: 'i' } }
                ];
            }
          if (status && status !== 'all') {
                filterCriteria.status = status;
            }
            
          const skip = (page - 1) * limit;
          
         const totalCount = await this._buildingRepository.countDocuments(filterCriteria); 

         const totalPages = Math.ceil(totalCount / limit);

         const {items:rawBuildings } = await this._buildingRepository.findAll(
                filterCriteria,
                skip,
                limit,
                { createdAt: -1 }
            ); 

          const buildings: IBuildingEntity[] = rawBuildings.map((building) => ({
                _id:building._id.toHexString(),
                buildingName: building.buildingName,
                vendorId: (building.vendorId as unknown as Types.ObjectId).toHexString(), 
                location: building.location,
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
                totalPages
            };

    }

}
