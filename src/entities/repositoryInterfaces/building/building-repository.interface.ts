import { IBuildingModel } from "../../../frameworks/database/mongo/models/building.model";
import { IBaseRepository } from "../base-repository.interface";

export interface IBuildingRepository extends IBaseRepository<IBuildingModel>{
    
}