import { IBuildingEntity } from "../../models/building.entity";
import { ISpaceEntity } from "../../models/space.entity";

export interface IGetSingleBuilding{
    execute(id:string): Promise<IBuildingEntity & { spaces: ISpaceEntity[] }>;
}