import { inject, injectable } from "tsyringe";
import { ILoginUserUseCase } from "../../entities/usecaseInterfaces/auth/login-usecase.interface";
import { LoginUserDTO } from "../../shared/dtos/user.dto";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IVendorModel } from "../../frameworks/database/mongo/models/vendor.model";
import { IAdminModel } from "../../frameworks/database/mongo/models/admin.model";
import { IClientModel } from "../../frameworks/database/mongo/models/client.model";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase{

    constructor(
        @inject("IClientRepository")
        private _clientRepository: IClientRepository,
        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository,
        @inject("IAdminRepository")
        private _adminRepository: IAdminRepository,
        @inject("IPasswordBcrypt")
        private _passwordBcrypt: IBcrypt,
    ){}
    async execute(user: LoginUserDTO): Promise<Partial<IVendorModel | IAdminModel | IClientModel>> {
        let repository;
        if(user.role === "client"){
            repository = this._clientRepository;
        }else if(user.role === "vendor"){
            repository = this._vendorRepository;
        }else if(user.role === "admin"){
            repository = this._adminRepository;
        }else{
            throw new CustomError("Invalid role", StatusCodes.BAD_REQUEST);
        }

       const userData = await repository.findOne({email: user.email});
       if(!userData){
            throw new CustomError("Invalid email. Please try again with another email",StatusCodes.BAD_REQUEST);
        }

        if(user.password){
            const isPasswordValid = await this._passwordBcrypt.compare(user.password, userData.password);
            if(!isPasswordValid){
                throw new CustomError("Invalid password", StatusCodes.BAD_REQUEST);
            }
        }

        if (user.fcmToken) {
            await repository.update(userData._id, { fcmToken: user.fcmToken });
            userData.fcmToken = user.fcmToken;
        }

        return userData;
    }
}