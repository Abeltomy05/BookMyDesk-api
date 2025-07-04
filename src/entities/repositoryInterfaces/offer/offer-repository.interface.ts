import { FilterQuery } from "mongoose";
import { IOfferModel } from "../../../frameworks/database/mongo/models/offer.model";
import { IBaseRepository } from "../base-repository.interface";
import { IOfferEntity } from "../../models/offer.entity";
import { IOfferWithNames } from "../../../shared/dtos/offer.dto";

export interface IOfferRepository extends IBaseRepository<IOfferModel>{
   findAllAndPoplulate(
    filter: FilterQuery<IOfferEntity>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ): Promise<{
    items: IOfferWithNames[];
    total: number;
  }>;
}