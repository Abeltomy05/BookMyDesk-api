import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IResetPasswordUseCase } from "../../entities/usecaseInterfaces/auth/reset-password.interface";
import { IClientEntity } from "../../entities/models/client.entity";
import { IVendorEntity } from "../../entities/models/vendor.entity";


@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        @inject("IJwtService")
        private _tokenService: IJwtService,
        @inject("IClientRepository")
        private _clientRepository: IClientRepository,
        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository,
        @inject("IRedisTokenRepository")
        private _redisTokenRepository: IRedisTokenRepository,
        @inject("IPasswordBcrypt")
        private _passwordBcrypt: IBcrypt,
    ){}

    async execute({ password, token}: { password: string; token:string;}): Promise<string> {
         const payload = this._tokenService.verifyResetToken(token);
        if (!payload || !payload.email) {
            throw new Error("Invalid or expired token");
        }

        const email = payload.email;
         let user: IClientEntity | IVendorEntity | null = null;
         let repository: IClientRepository | IVendorRepository = this._clientRepository;
         let role: 'client' | 'vendor' = 'client';
         
		 const clientUser = await this._clientRepository.findOne({ email });
         if (clientUser) {
            user = { ...clientUser, _id: clientUser._id.toString() };
            repository = this._clientRepository;
         }

         if (!user) {
           const vendorUser = await this._vendorRepository.findOne({ email });
             if (vendorUser) {
                    user = { ...vendorUser, _id: vendorUser._id.toString() };
                    repository = this._vendorRepository;
                    role = "vendor";
                }
         }

          if (!user) {
            throw new Error("User not found");
          }

        const tokenIsValid = await this._redisTokenRepository.verifyResetToken(token, email);
        if (!tokenIsValid) {
            throw new Error("Invalid or expired token");
        }

        const hashedPassword = await this._passwordBcrypt.hash(password);

        await repository.update({email},{password: hashedPassword});
        await this._redisTokenRepository.deleteResetToken(token);

        return role;
    }
}