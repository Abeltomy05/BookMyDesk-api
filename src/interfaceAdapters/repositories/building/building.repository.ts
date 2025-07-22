import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { BuildingModel, IBuildingModel } from "../../../frameworks/database/mongo/models/building.model";
import { IBuildingRepository } from "../../../entities/repositoryInterfaces/building/building-repository.interface";
import { FilterQuery } from "mongoose";

@injectable()
export class BuildingRepository extends BaseRepository<IBuildingModel> implements IBuildingRepository{
   constructor(){
    super(BuildingModel)
   }

    async findAndPopulate(
    filter: any,
    skip: number,
    limit: number,
    sort: any = { createdAt: -1 },
    populateFields: { path: string; select?: string }[] = []
  ): Promise<{ items: any[] }> {
    let query = this.model.find(filter).skip(skip).limit(limit).sort(sort);

    // Apply each populate
    for (const populate of populateFields) {
      query = query.populate(populate);
    }

    const items = await query.lean();
    return { items };
  }

  async searchBuildings(
  filters: {
      locationName?: string;
      type?: string;
      minPrice?: number;
      maxPrice?: number;
      latitude?: number;
      longitude?: number;
      radius?: number;
      amenities?: string[];
      amenityMatchMode?: 'any' | 'all';
    },
    skip = 0,
    limit = 10,
    sort: Record<string, 1 | -1> = {}
  ) {
    const query: FilterQuery<IBuildingModel> = {
      status: "approved"
    };

     if (filters.locationName) {
    query["location.name"] = { $regex: filters.locationName, $options: "i" };
  }

  if (filters.type || filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const summarizedSpaceQuery: any = {};

    if (filters.type) {
      summarizedSpaceQuery.name = filters.type;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      summarizedSpaceQuery.price = {};
      if (filters.minPrice !== undefined) {
        summarizedSpaceQuery.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        summarizedSpaceQuery.price.$lte = filters.maxPrice;
      }
    }

    query["summarizedSpaces"] = { $elemMatch: summarizedSpaceQuery };
  }

  if (filters.amenities && filters.amenities.length > 0) {
    if (filters.amenityMatchMode === "any") {
    query["amenities"] = { $in: filters.amenities };
  } else {
    query["amenities"] = { $all: filters.amenities };
  }
  }

  if (filters.latitude && filters.longitude && filters.radius) {
    const radiusInRadians = filters.radius / 6378.1;
     query["location"] = {
      $geoWithin: {
        $centerSphere: [[filters.longitude, filters.latitude], radiusInRadians],
      },
    }
  }

  const [items, total] = await Promise.all([
    this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
    this.model.countDocuments(query),
  ]);

  return { items, total };
 }

async getNamesAndCount(): Promise<{ names: { _id: string; buildingName: string }[]; count: number }> {
  const buildings = await BuildingModel.find({}, { _id: 1, buildingName: 1 }).lean()
  const mapped = buildings.map((b) => ({
    _id: b._id.toString(), 
    buildingName: b.buildingName,
  }))
  return {
    names: mapped,
    count: mapped.length,
  }
}
}