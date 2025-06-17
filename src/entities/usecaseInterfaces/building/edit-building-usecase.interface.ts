import { IBuildingEntity } from "../../models/building.entity";
import { ISpaceEntity } from "../../models/space.entity";

export interface IEditBuildingUsecase{
     execute(
    buildingDataToUpdate: Partial<Omit<IBuildingEntity, "vendorId" | "status" | "createdAt" | "updatedAt" | "summarizedSpaces">> & { id: string },
    spaceList: ISpaceEntity[]
    ): Promise<IBuildingEntity>;
     
}