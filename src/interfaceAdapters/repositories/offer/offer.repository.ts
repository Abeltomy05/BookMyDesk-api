import { injectable } from "tsyringe";
import { IOfferModel, OfferModel } from "../../../frameworks/database/mongo/models/offer.model";
import { BaseRepository } from "../base.repository";
import { IOfferRepository } from "../../../entities/repositoryInterfaces/offer/offer-repository.interface";
import { FilterQuery } from "mongoose";
import { IOfferEntity } from "../../../entities/models/offer.entity";

@injectable()
export class OfferRepository extends BaseRepository<IOfferModel> implements IOfferRepository{
   constructor(){
    super(OfferModel)
   }

   async findAllAndPoplulate(
      filter: FilterQuery<IOfferEntity>,
      skip = 0,
      limit = 10,
      sort: Record<string, 1 | -1> = {}
      ): Promise<{ items: any[]; total: number }> {
      const [items, total] = await Promise.all([
         this.model
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('buildingId', 'buildingName') 
            .populate('spaceId', 'name') 
            .lean(),
         this.model.countDocuments(filter),
      ]);

      return { items, total };
   }

}