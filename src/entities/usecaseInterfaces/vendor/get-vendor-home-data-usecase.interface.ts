import { VendorHomeDataResultDTO } from "../../../shared/dtos/booking.dto";

export interface IGetVendorHomeData{
     execute(vendorId: string, page:number, limit:number,onlyTable:boolean):Promise<VendorHomeDataResultDTO>
}