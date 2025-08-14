import { inject, injectable } from "tsyringe";
import { IAmenityEntity } from "../../entities/models/amenity.entity";
import { IAmenityRepository } from "../../entities/repositoryInterfaces/building/amenity-repository.interface";
import { IGetAllAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/get-all-amenity-usecase.interface";

@injectable()
export class GetAllAmenityUseCase implements IGetAllAmenityUseCase{
    constructor(
      @inject("IAmenityRepository")
      private _amenityRepo: IAmenityRepository,
    ){}

    async execute(
         page: number,
         limit: number,
         search?: string,
         status?: string
        ):Promise<{
            data: {_id:string,name:string,status?: string}[];
            currentPage: number;
            totalItems: number;
            totalPages: number;
        }>{
         const skip = (page - 1) * limit;

         const filter: {
           name?: { $regex: string; $options: string },
           status?: string | { $nin: string[] };
         } = {};

         if (search) filter.name = { $regex: search, $options: 'i' };
         
          if (status && (status === "active" || status === "non-active")){
            filter.status = status;
          } else {
            filter.status = { $nin: ["pending", "rejected"] };
          }

         const { items, total } = await this._amenityRepo.findAll(filter, skip, limit, { createdAt: -1 });

         const mapped: IAmenityEntity[] = items.map((doc) => ({
                _id: doc._id.toString(),
                name: doc.name,
                status: doc.status,
            }));
          

         return {
            data: mapped,
            currentPage: page,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
         };
    }
}