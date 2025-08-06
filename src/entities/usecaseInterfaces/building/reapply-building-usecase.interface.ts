import { BuildingAndSpaceResult } from "../../../useCases/building/get-reapply-building.usecase";
import { IBuildingEntity } from "../../models/building.entity";

export interface IGetReApplyBuildingData{
    execute(token: string):Promise<BuildingAndSpaceResult>;
}