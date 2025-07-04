import { FetchOffersResultDTO } from "../../../shared/dtos/offer.dto";

export interface IFetchAllOffersUseCase{
    execute(vendorId:string,page:number,limit:number):Promise<FetchOffersResultDTO>
}