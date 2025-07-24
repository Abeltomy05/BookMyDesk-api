import { EveryBuildingUsecaseResponseDTO } from "../../../shared/dtos/building.dto";

export interface IGetEveryBuildingUseCase{
    execute(page:number,limit:number,search:string,status:string): Promise<{items:EveryBuildingUsecaseResponseDTO[]; total:number}> 
}