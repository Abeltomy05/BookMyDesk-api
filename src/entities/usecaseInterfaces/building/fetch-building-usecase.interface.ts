import { IBuildingEntity } from "../../models/building.entity";

export interface IFetchBuildingUseCase{
   execute(page: number, limit: number): Promise<{ items: IBuildingEntity[]; total: number }>;
}