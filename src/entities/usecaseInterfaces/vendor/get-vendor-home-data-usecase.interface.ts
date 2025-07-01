import { VendorHomeDataResultDTO } from "../../../shared/dtos/booking.dto";

export interface IGetVendorHomeData{
     execute(vendorId: string, page:number, limit:number):Promise<VendorHomeDataResultDTO>
}