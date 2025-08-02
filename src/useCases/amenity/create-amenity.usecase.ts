import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../entities/utils/custom.error";
import { inject, injectable } from "tsyringe";
import { IAmenityRepository } from "../../entities/repositoryInterfaces/building/amenity-repository.interface";
import { ICreateAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/create-amenity-usecase.interface";

@injectable()
export class CreateAmenityUseCase implements ICreateAmenityUseCase{
    constructor(
       @inject("IAmenityRepository")
       private _amenityRepo: IAmenityRepository,
    ){}

    async execute(name: string):Promise<void>{
        if(!name || typeof name != 'string'){
           throw new CustomError("Amenity name is needed and it must be a string.",StatusCodes.BAD_REQUEST);
        }
            const existing = await this._amenityRepo.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
            if (existing) {
                throw new CustomError("Amenity with this name already exists.", StatusCodes.CONFLICT);
            }

            await this._amenityRepo.save({ name });
    }
}