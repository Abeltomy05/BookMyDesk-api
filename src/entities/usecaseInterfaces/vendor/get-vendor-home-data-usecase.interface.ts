import { VendorHomeDataResultDTO } from "../../../shared/dtos/booking.dto";

export interface IGetVendorHomeData{
     execute(vendorId: string):Promise<VendorHomeDataResultDTO>
}