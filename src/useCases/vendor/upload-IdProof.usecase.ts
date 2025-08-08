import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IVendorModel } from "../../frameworks/database/mongo/models/vendor.model";
import { IUploadIdProofUseCase } from "../../entities/usecaseInterfaces/vendor/uploadIdProof-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class UploadIdProofUseCase implements IUploadIdProofUseCase{
    constructor(
        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository
    ) {}

    async uploadIdProof(vendorId: string, idProof: string): Promise<IVendorModel> {
        try {
            if (!vendorId || !idProof) {
                throw new CustomError(ERROR_MESSAGES.MISSING_CREDENTIALS,StatusCodes.BAD_REQUEST);
            }
            console.log("Vendor ID:", vendorId, "ID Proof:", idProof);
            const vendor  = await this._vendorRepository.findOne({ _id: vendorId });
             if (!vendor ) {
                throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,StatusCodes.NOT_FOUND);
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