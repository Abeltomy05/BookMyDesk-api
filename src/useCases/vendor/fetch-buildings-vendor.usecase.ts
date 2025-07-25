import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IFetchBuildingsForVendorUseCase } from "../../entities/usecaseInterfaces/vendor/fetch-building-vendor-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

export interface IBuildingShort {
  _id: string;
  buildingName: string;
}

@injectable()
export class FetchBuildingsForVendorUseCase implements IFetchBuildingsForVendorUseCase{
    constructor(
      @inject("IBuildingRepository")
      private _buildingRepo: IBuildingRepository
    ){}

    async execute(vendorId: string):Promise<IBuildingShort[]>{
       if(!vendorId) throw new CustomError("Vendor Id is neccessary, Please contact support.",StatusCodes.BAD_REQUEST);

       const buildingDetails = await this._buildingRepo.find(
         {vendorId},
         {buildingName:1}
        );

         return buildingDetails.map((b) => ({
            _id: b._id.toString(),
            buildingName: b.buildingName,
         }));
    }
}