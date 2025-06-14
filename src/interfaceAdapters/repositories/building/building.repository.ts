import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { BuildingModel, IBuildingModel } from "../../../frameworks/database/mongo/models/building.model";
import { IBuildingRepository } from "../../../entities/repositoryInterfaces/building/building-repository.interface";

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

}