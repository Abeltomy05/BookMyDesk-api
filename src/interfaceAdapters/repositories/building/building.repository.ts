import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { BuildingModel, IBuildingModel } from "../../../frameworks/database/mongo/models/building.model";
import { IBuildingRepository } from "../../../entities/repositoryInterfaces/building/building-repository.interface";

@injectable()
export class BuildingRepository extends BaseRepository<IBuildingModel> implements IBuildingRepository{
   constructor(){
    super(BuildingModel)
   }
}