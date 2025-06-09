import { inject, injectable } from "tsyringe";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IGetRetryDataUseCase } from "../../entities/usecaseInterfaces/vendor/get-retry-data.interface";

@injectable()
export class GetRetryDataUseCase implements IGetRetryDataUseCase{
    constructor(
      @inject("IJwtService")
      private _tokenService: IJwtService,
      @inject("IVendorRepository")
      private _vendorRepository: IVendorRepository
    ){}

    async execute(token:string):Promise<{
          email:string
          phoneNumber: string
          companyName: string
          companyAddress: string
          idProof?: string
    }>{
        const payload = this._tokenService.verifyResetToken(token);
        if (!payload || !payload.email) {
            throw new Error("Invalid or expired token");
        }

        const vendor = await this._vendorRepository.findOne({email:payload.email});

         if (!vendor) {
          throw new Error("Vendor not found")
        }

         return {
            email:payload.email,
            phoneNumber: vendor.phone,
            companyName: vendor.companyName,
            companyAddress: vendor.companyAddress,
            idProof: vendor.idProof,
            }
    }
}