import { inject, injectable } from "tsyringe";
import { IOfferRepository } from "../../entities/repositoryInterfaces/offer/offer-repository.interface";
import { FetchOffersResultDTO } from "../../shared/dtos/offer.dto";
import { IFetchAllOffersUseCase } from "../../entities/usecaseInterfaces/offer/fetch-all-offers-usecase.interface";
import { OfferStatus } from "../../shared/types/user.types";


@injectable()
export class FetchAllOffersUseCase implements IFetchAllOffersUseCase{
    constructor(
      @inject("IOfferRepository")
      private _offerRepo: IOfferRepository,
    ){}

    async execute(vendorId:string,page:number,limit:number):Promise<FetchOffersResultDTO>{
       if(!vendorId) throw new Error("VendorId missing, Please contact for support.");

       const skip = (page - 1) * limit;

       const filter = { vendorId };

       const { items, total } = await this._offerRepo.findAllAndPoplulate(filter, skip, limit, { createdAt: -1 });

       const now = new Date();

  const formatted = items.map((offer) => {
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);

        let status: 'upcoming' | 'ongoing' | 'expired';

        if (now < start) {
          status = 'upcoming';
        } else if (now > end) {
          status = 'expired';
        } else {
          status = 'ongoing';
        }

        return {
          _id: offer._id.toString(),
          spaceId: offer.spaceId?._id?.toString?.() ?? "",
          spaceName: offer.spaceId?.name ?? "",
          buildingId: offer.buildingId?._id?.toString?.() ?? "",
          buildingName: offer.buildingId?.buildingName ?? "",
          vendorId: offer.vendorId?.toString?.(),
          discountPercentage: offer.discountPercentage,
          title: offer.title,
          description: offer.description,
          status, 
          startDate: offer.startDate,
          endDate: offer.endDate,
          createdAt: offer.createdAt,
          updatedAt: offer.updatedAt,
        };
  });

   return {
      offers: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }

 }

}