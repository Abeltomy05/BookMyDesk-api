import { IBuildingModel } from "../../../frameworks/database/mongo/models/building.model";
import { IBuildingEntity } from "../../models/building.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IBuildingRepository extends IBaseRepository<IBuildingModel>{
    findAndPopulate(
    filter: any,
    skip: number,
    limit: number,
    sort: any,
    populateFields: { path: string; select?: string }[]
  ): Promise<{ items: any[] }>;

  searchBuildings(
    filters: {
      locationName?: string;
      type?: string;
      minPrice?: number;
      maxPrice?: number;
    },
    skip?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>
  ): Promise<{ items: IBuildingModel[]; total: number }>;
}