import { BuildingRegistrationData } from "../../../shared/dtos/types/building.types";
import { IBuildingEntity } from "../../models/building.entity";

export interface IRegisterBuildingUsecase{
    execute(data: BuildingRegistrationData, vendorId: string): Promise<IBuildingEntity>;
    
}