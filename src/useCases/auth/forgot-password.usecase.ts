import { inject, injectable } from "tsyringe";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IForgotPasswordUseCase } from "../../entities/usecaseInterfaces/auth/forgot-pasword-usecase.interface";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        @inject("IEmailService")
           private _emailService: IEmailService,
         @inject("IRedisTokenRepository")
              private _redisTokenRepository: IRedisTokenRepository,
        @inject("IClientRepository")
              private _clientRepository: IClientRepository,
         @inject("IVendorRepository")
              private _vendorRepository: IVendorRepository, 
         @inject("IJwtService")
            private _tokenService: IJwtService,        
    ){}
     
    async execute({email,role}:{email:string,role:string}): Promise<void> {
       let repository;
         if(role==="client") repository = this._clientRepository;
         else if(role==="vendor") repository = this._vendorRepository;
         else throw new Error("Invalid role");

         const user = await repository.findOne({email});
            if (!user) {
                throw new Error("User not found");
            }

          const resetToken = this._tokenService.generateResetToken(email);
            try {
			await this._redisTokenRepository.storeResetToken(
				email,
        resetToken
			);
		} catch (error) {
			console.error("Failed to store reset token in Redis:", error);
			throw new Error("Failed to store reset token");
		}
        const rolePrefix = role !== "client" ? `/${role}` : "";
		const resetUrl = new URL(
			`${rolePrefix}/reset-password/${resetToken}`,
			process.env.CORS_ORIGIN
		).toString();

		await this._emailService.sendResetEmail(
			email,
			"BookMyDesk - Reset your password",
			resetUrl
		);
   }
}