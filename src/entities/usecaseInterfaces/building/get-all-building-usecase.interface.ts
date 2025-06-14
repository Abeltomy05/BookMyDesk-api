import { IBuildingEntity } from "../../models/building.entity";

export interface IGetAllBuildingsUsecase{
    execute(
        page: number,
        limit: number,
        search: string,
        status?: string
    ): Promise<{ buildings: IBuildingEntity[]; totalPages: number }>;
    
}