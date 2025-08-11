import { PendingAmenityDTO } from "../../../shared/dtos/amenity.dto";

export interface IPendingAmenityUseCase{
    execute(page:number,limit:number):Promise<PendingAmenityDTO>;
}