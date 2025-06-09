import { inject, injectable } from "tsyringe";
import { IRetryRegistration } from "../../entities/usecaseInterfaces/vendor/retry-registration.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";

@injectable()
export class RetryRegistration implements IRetryRegistration{
    constructor(
       @inject("IVendorRepository")
       private _vendorRepository: IVendorRepository
    ){}

    async execute({
        email,
        phone,
        companyName,
        companyAddress,
        idProof
    }: {
        email: string
        phone: string
        companyName: string
        companyAddress: string
        idProof: string
    }): Promise<void>{
        console.log("Updating vendor in usecase with",email,phone,companyName);
         const existingVendor = await this._vendorRepository.findOne({email});
         if (!existingVendor) {
            throw new Error("Vendor not found");
            }

        const updatedVendor = await this._vendorRepository.update(
                                        { email },
                                        {
                                        phone,
                                        companyName,
                                        companyAddress,
                                        idProof,
                                        status: "pending",
                                        }
                                         );  
         console.log("Updated Vendor is",updatedVendor)                                
    }
}