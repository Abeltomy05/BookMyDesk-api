import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";
import { ISaveFcmTokenUseCase } from "../../entities/usecaseInterfaces/auth/save-fcm-token-usecase.interface";

@injectable()
export class SaveFcmTokenUseCase implements ISaveFcmTokenUseCase{
    constructor(
     @inject("IClientRepository")
     private _clientRepo: IClientRepository,
     @inject("IVendorRepository")
     private _vendorRepo: IVendorRepository,
     @inject("IAdminRepository")
     private _adminRepo: IAdminRepository,
    ){}

    async execute(fcmToken:string,userId:string,role:string):Promise<void>{
       let repo;
       if(role === "client")
         repo = this._clientRepo
       else if(role === "vendor")
         repo = this._vendorRepo
       else if(role === "admin")
         repo = this._adminRepo
       else
         throw new Error("Invalid role.") ;

       await repo.update({_id:userId},{fcmToken})  
    }
}