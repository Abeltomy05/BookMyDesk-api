import { inject, injectable } from "tsyringe";
import { IAmenityRepository } from "../../entities/repositoryInterfaces/building/amenity-repository.interface";
import { IAmenityEntityPopulated, PendingAmenityDTO } from "../../shared/dtos/amenity.dto";
import { IPendingAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/pending-amenity-usecase.interface";


@injectable()
export class PendingAmenityUseCase implements IPendingAmenityUseCase{
    constructor(
      @inject("IAmenityRepository")
      private _amenityRepo: IAmenityRepository,
    ){}

    async execute(page:number,limit:number):Promise<PendingAmenityDTO>{
       const { items, totalItems }  = await this._amenityRepo.findWithPopulatePaginated<IAmenityEntityPopulated>(
        {status:"pending"},
        [{path:'requestedBy', select:'username email'}],
        { createdAt: -1 },
        page,
        limit,
    );

     return {
      data:items.map((amenity) => ({
        _id: amenity._id.toString(),
        name: amenity.name,
        description: amenity.description,
        status: amenity.status,
        createdAt: amenity.createdAt,
        requestedBy: {
          username: amenity.requestedBy?.username || "",
          email: amenity.requestedBy?.email || "",
        },
      })),
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };
    }
}