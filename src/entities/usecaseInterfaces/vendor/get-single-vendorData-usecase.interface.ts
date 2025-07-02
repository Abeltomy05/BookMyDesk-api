import { IVendorDataResponseDTO } from "../../../shared/dtos/vendorInfo.dto";

export interface IGetSingleVendorData{
     execute(vendorId:string):Promise<IVendorDataResponseDTO>;
}