import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IVendorModel } from "../../frameworks/database/mongo/models/vendor.model";
import { IUploadIdProofUseCase } from "../../entities/usecaseInterfaces/vendor/uploadIdProof-usecase.interface";

@injectable()
export class UploadIdProofUseCase implements IUploadIdProofUseCase{
    constructor(
        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository
    ) {}

    async uploadIdProof(vendorId: string, idProof: string): Promise<IVendorModel> {
        try {
            if (!vendorId || !idProof) {
                throw new Error("Vendor ID and ID proof are required");
            }
            console.log("Vendor ID:", vendorId, "ID Proof:", idProof);
            const vendor  = await this._vendorRepository.findOne({ _id: vendorId });
             if (!vendor ) {
                throw new Error("Vendor not found");
              }

             vendor.idProof = idProof;
            await this._vendorRepository.update( { _id: vendorId },  { idProof }); 
            return vendor;
        } catch (error) {
            console.error("Error in UploadIdProofUseCase:", error);
            throw error; 
        }
    }
}