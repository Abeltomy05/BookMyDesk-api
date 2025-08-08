import { inject, injectable } from "tsyringe";
import { IAdminModel } from "../../frameworks/database/mongo/models/admin.model";
import { IClientModel } from "../../frameworks/database/mongo/models/client.model";
import { IVendorModel } from "../../frameworks/database/mongo/models/vendor.model";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";
import { IGetMeUseCase } from "../../entities/usecaseInterfaces/auth/get-me-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class GetMe implements IGetMeUseCase{
    constructor(
        @inject("IJwtService")
        private _tokenService: IJwtService,
        @inject("IClientRepository")
        private _clientRepository: IClientRepository,
        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository,
        @inject("IAdminRepository")
        private _adminRepository: IAdminRepository,
    ){}

    async execute(token: string):Promise<Partial<IVendorModel | IClientModel | IAdminModel> | null>{
         const payload = this._tokenService.verifyAccessToken(token);
          if (!payload) {
               throw new CustomError(ERROR_MESSAGES.INVALID_TOKEN, StatusCodes.BAD_REQUEST);
          }

          let repository;
          if(payload.role === 'client'){
            repository = this._clientRepository;
          }else if(payload.role === 'vendor'){
            repository = this._vendorRepository;
          }else if(payload.role === 'admin'){
            repository = this._adminRepository;
          }else{
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE,StatusCodes.BAD_REQUEST)
          }
       
          const user = await repository.findOne({email:payload.email});
           return user;    
    }
}