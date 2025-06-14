import { IBuildingEntity } from "../../models/building.entity";

export interface IGetBuildingsForVerification{
     execute(
        page: number,
        limit: number,
        status:string,
     ): Promise<{ buildings: IBuildingEntity[]; totalPages: number; currentPage: number }>;
}