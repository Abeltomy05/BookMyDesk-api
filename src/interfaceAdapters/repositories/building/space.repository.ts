import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { ISpaceModel, SpaceModel } from "../../../frameworks/database/mongo/models/space.model";
import { ISpaceRepository } from "../../../entities/repositoryInterfaces/building/space-repository.interface";
import { ISpaceEntity } from "../../../entities/models/space.entity";
import { Types } from "mongoose";

@injectable()
export class SpaceRepository extends BaseRepository<ISpaceModel> implements ISpaceRepository{
   constructor(){
    super(SpaceModel)
   }

   async bulkInsert(spaces: ISpaceEntity[]): Promise<void> {
      const docs = spaces.map(space => ({
         ...space,
         buildingId: new Types.ObjectId(space.buildingId)
      }));
    await SpaceModel.insertMany(docs); 
   }
}