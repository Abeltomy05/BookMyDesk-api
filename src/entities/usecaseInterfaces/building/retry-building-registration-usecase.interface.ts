import { Building } from "../../../shared/dtos/building.dto";

export interface IRetryBuildingRegistrationUseCase{
    execute(building:Building):Promise<void>;
}