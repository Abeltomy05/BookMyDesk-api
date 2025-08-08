import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../entities/utils/custom.error";
import { inject, injectable } from "tsyringe";
import { IAmenityRepository } from "../../entities/repositoryInterfaces/building/amenity-repository.interface";
import { ICreateAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/create-amenity-usecase.interface";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class CreateAmenityUseCase implements ICreateAmenityUseCase{
    constructor(
       @inject("IAmenityRepository")
       private _amenityRepo: IAmenityRepository,
    ){}

    async execute(name: string):Promise<void>{
        if(!name || typeof name != 'string'){
           throw new CustomError(ERROR_MESSAGES.AMENITY_NAME_REQUIRED,StatusCodes.BAD_REQUEST);
        }
            const existing = await this._amenityRepo.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
            if (existing) {
                throw new CustomError(ERROR_MESSAGES.AMENITY_EXIST, StatusCodes.CONFLICT);
            }

            await this._amenityRepo.save({ name });
    }
}