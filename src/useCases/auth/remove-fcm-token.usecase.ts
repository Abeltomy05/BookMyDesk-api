import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";
import { IRemoveFcmTokenUseCase } from "../../entities/usecaseInterfaces/auth/remove-fcm-token-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class RemoveFcmTokenUseCase implements IRemoveFcmTokenUseCase{
    constructor(
        @inject("IClientRepository")
        private _clientRepo: IClientRepository,
        @inject("IVendorRepository")
        private _vendorRepo: IVendorRepository,
        @inject("IAdminRepository")
        private _adminRepo: IAdminRepository,
    ){}

    async execute (userId:string,role:string):Promise<void>{
      let repo;
       if(role === "client")
         repo = this._clientRepo
       else if(role === "vendor")
         repo = this._vendorRepo
       else if(role === "admin")
         repo = this._adminRepo
       else
         throw new CustomError(ERROR_MESSAGES.INVALID_ROLE,StatusCodes.BAD_REQUEST);

         await repo.update({_id:userId},{fcmToken:""})
    }
}