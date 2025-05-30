import { IVendorModel } from "../../../frameworks/database/mongo/models/vendor.model";

export interface IUploadIdProofUseCase{
    uploadIdProof(vendorId: string, idProof: string): Promise<IVendorModel>;
}