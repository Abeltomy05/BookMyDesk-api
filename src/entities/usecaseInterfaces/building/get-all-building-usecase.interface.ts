import { IBuildingEntity } from "../../models/building.entity";

export interface IGetAllBuildingsUsecase{
    execute(
        vendorId:string,
        page: number,
        limit: number,
        search: string,
        status?: string,
    ): Promise<{ buildings: IBuildingEntity[]; totalPages: number }>;
    
}