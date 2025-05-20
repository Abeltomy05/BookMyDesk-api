import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IResetPasswordUseCase } from "../../entities/usecaseInterfaces/auth/reset-password.interface";


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

    async execute({ password, token, role }: { password: string; token:string; role: string }): Promise<void> {
         const payload = this._tokenService.verifyResetToken(token);
        if (!payload || !payload.email) {
            throw new Error("Invalid or expired token");
        }

        const email = payload.email;
		let repository;

        if (role === "client") {
            repository = this._clientRepository;
        }else if (role === "vendor") {
            repository = this._vendorRepository;
        }else{
            throw new Error("Invalid role");
        }

        const user = await  repository.findOne({email});
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
    }
}