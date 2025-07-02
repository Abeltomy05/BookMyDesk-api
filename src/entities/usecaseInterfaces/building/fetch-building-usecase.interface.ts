import { IBuildingEntity } from "../../models/building.entity";

export interface IFetchBuildingUseCase{
   execute(page: number, limit: number, filters: {
        locationName?: string;
        type?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{ items: IBuildingEntity[]; total: number }>;
}