import { ISpaceModel } from "../../../frameworks/database/mongo/models/space.model";
import { ISpaceEntity } from "../../models/space.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface ISpaceRepository extends IBaseRepository<ISpaceModel>{
     bulkInsert(spaces: Partial<ISpaceEntity>[]): Promise<void>;
}