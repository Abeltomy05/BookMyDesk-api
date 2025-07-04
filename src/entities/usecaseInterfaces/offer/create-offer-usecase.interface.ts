import { createOfferParams } from "../../../useCases/offer/create-offer.usecase";

export interface ICreateOfferUseCase{
    execute({title,description,percentage,startDate,endDate,spaceId,buildingId,vendorId}:createOfferParams):Promise<{success:boolean}>;
}