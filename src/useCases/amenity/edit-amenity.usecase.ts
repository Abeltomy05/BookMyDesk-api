import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../entities/utils/custom.error";
import { inject, injectable } from "tsyringe";
import { IAmenityRepository } from "../../entities/repositoryInterfaces/building/amenity-repository.interface";
import { IEditAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/edit-amenity-usecase.interface";

@injectable()
export class EditAmenityUseCase implements IEditAmenityUseCase{
    constructor(
       @inject("IAmenityRepository")
       private _amenityRepo: IAmenityRepository,
    ){}

    async execute(id:string,name:string):Promise<void>{
        if(typeof name !== 'string'){
            throw new CustomError("Name of amenity should be string.",StatusCodes.BAD_REQUEST);
        }

        const existingaAmenity = await this._amenityRepo.findOne({_id:id});
        if(!existingaAmenity){
            throw new CustomError("Amenity not found",StatusCodes.NOT_FOUND);
        }

        const duplicate = await this._amenityRepo.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        if (duplicate && duplicate._id.toString() !== id) {
          throw new CustomError("Another amenity with this name already exists.", StatusCodes.CONFLICT);
        }

        await this._amenityRepo.update({_id:id},{name})
    }
}