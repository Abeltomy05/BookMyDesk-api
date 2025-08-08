import { inject, injectable } from "tsyringe";
import { IAmenityRepository } from "../../entities/repositoryInterfaces/building/amenity-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { IDeleteAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/delete-amenity-usecase.interface";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class DeleteAmenityUseCase implements IDeleteAmenityUseCase{
    constructor(
       @inject("IAmenityRepository")
       private _amenityRepo: IAmenityRepository,
    ){}

    async execute(id: string):Promise<void>{
            const existing = await this._amenityRepo.findOne({ _id:id });
            if (!existing) {
                throw new CustomError(ERROR_MESSAGES.AMENITY_DONT_EXIST, StatusCodes.NOT_FOUND);
            }

            await this._amenityRepo.delete({ _id:id });
    }
}