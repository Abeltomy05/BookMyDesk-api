import { BuildingRegistrationData } from "../../../shared/validations/register-building.validation";
import { IBuildingEntity } from "../../models/building.entity";

export interface IRegisterBuildingUsecase{
    execute(data: BuildingRegistrationData, vendorId: string): Promise<IBuildingEntity>;
    
}