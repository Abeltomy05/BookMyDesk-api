import { inject, injectable } from "tsyringe";
import { IOfferRepository } from "../../entities/repositoryInterfaces/offer/offer-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { Types } from "mongoose";
import { ICreateOfferUseCase } from "../../entities/usecaseInterfaces/offer/create-offer-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

export interface createOfferParams{
    title:string;
    description?:string;
    percentage:number;
    startDate:string;
    endDate:string;
    spaceId:string;
    buildingId:string;
    vendorId:string;
}

@injectable()
export class CreateOfferUseCase implements ICreateOfferUseCase{
    constructor(
      @inject("IOfferRepository")
      private _offerRepo:IOfferRepository, 
      @inject("IBuildingRepository")
      private _buildingRepo: IBuildingRepository,
      @inject("ISpaceRepository")
      private _spaceRepo: ISpaceRepository,
    ){}

    async execute({title,description,percentage,startDate,endDate,spaceId,buildingId,vendorId}:createOfferParams):Promise<{success:boolean}>{
        const building = await this._buildingRepo.findOne({ _id: buildingId, vendorId });
        if (!building) {
        throw new CustomError(ERROR_MESSAGES.BUILDING_NOT_FOUND,StatusCodes.NOT_FOUND);
        }

        const space = await this._spaceRepo.findOne({ _id: spaceId, buildingId });
        if (!space) {
        throw new CustomError(ERROR_MESSAGES.SPACE_NOT_FOUND,StatusCodes.NOT_FOUND);
        }

         const start = new Date(startDate);
         const end = new Date(endDate);
         const now = new Date();

         const overlappingOffer = await this._offerRepo.findOne({
            spaceId: new Types.ObjectId(spaceId),
            $or: [
            {
                startDate: { $lte: end },
                endDate: { $gte: start }
            }
            ]
         });
         if (overlappingOffer) {
            throw new CustomError(ERROR_MESSAGES.OFFER_EXIST, StatusCodes.CONFLICT);
         }

        await this._offerRepo.save({
            title,
            description,
            discountPercentage: percentage,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            buildingId: new Types.ObjectId(buildingId),
            spaceId: new Types.ObjectId(spaceId),
            vendorId: new Types.ObjectId(vendorId),
         });

         return{
            success:true
         }
    }
}