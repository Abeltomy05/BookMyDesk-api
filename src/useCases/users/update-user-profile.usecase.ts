import { inject, injectable } from "tsyringe"
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface"
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface"
import { IUpdateUserProfileUseCase } from "../../entities/usecaseInterfaces/users/update-user-profile.interface"
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

interface UpdateProfileData {
    username?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    location?: {
        type?: string;
        name?: string;
        displayName?: string;
        zipCode?: string;
        coordinates?: number[];
    };
}

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase{
    constructor(
        @inject("IClientRepository")
        private _clientRepository: IClientRepository,
        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository,
    ) {}


    async execute(userId: string, role: string, data: UpdateProfileData): Promise<any> {
        if (role === 'client') {
         const updatedUser = await this._clientRepository.update({ _id: userId }, data);
        if (!updatedUser) throw new CustomError("User not found",StatusCodes.NOT_FOUND);
        return updatedUser;
        }

        if (role === 'vendor') {
         const updatedVendor = await this._vendorRepository.update({ _id: userId }, data);
         if (!updatedVendor) throw new CustomError("Vendor not found",StatusCodes.NOT_FOUND);
         return updatedVendor;
        } 

        throw new CustomError("Invalid role for profile update.",StatusCodes.BAD_REQUEST);

    }
}