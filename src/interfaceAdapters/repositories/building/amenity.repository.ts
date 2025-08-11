import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { AmenityModel, IAmenityModel } from "../../../frameworks/database/mongo/models/amenity.model";
import { IAmenityRepository } from "../../../entities/repositoryInterfaces/building/amenity-repository.interface";
import { FilterQuery } from "mongoose";

@injectable()
export class AmenityRepository extends BaseRepository<IAmenityModel> implements IAmenityRepository{
   constructor(){
    super(AmenityModel)
   }

async findWithPopulatePaginated<TReturn = IAmenityModel>(
    filter: FilterQuery<IAmenityModel>,
    populateFields: { path: string; select?: string }[],
    sort: Record<string, 1 | -1> = {},
    page: number,
    limit: number
  ): Promise<{ items: TReturn[]; totalItems: number }> {
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(populateFields.map(({ path, select }) => ({ path, select })))
        .lean() as Promise<TReturn[]>,
      this.model.countDocuments(filter),
    ]);

    return { items, totalItems };
  }

}