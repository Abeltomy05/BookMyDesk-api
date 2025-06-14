import { BuildingRegistrationData } from "../../../shared/types/building.types";
import { IBuildingEntity } from "../../models/building.entity";

export interface IRegisterBuildingUsecase{
    execute(data: BuildingRegistrationData, vendorId: string): Promise<IBuildingEntity>;
    
}