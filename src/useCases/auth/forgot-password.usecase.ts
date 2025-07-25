import { inject, injectable } from "tsyringe";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IForgotPasswordUseCase } from "../../entities/usecaseInterfaces/auth/forgot-pasword-usecase.interface";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IClientEntity } from "../../entities/models/client.entity";
import { config } from "../../shared/config";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

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
     
    async execute(email:string): Promise<void> {
          let user: IClientEntity | IVendorEntity | null = null;
          let role: 'client' | 'vendor' = 'client';

          const rawClient = await this._clientRepository.findOne({ email });
            if (rawClient) {
              user = {
                ...rawClient,
                _id: rawClient._id.toString(),
              };
            } else {
              const rawVendor = await this._vendorRepository.findOne({ email });
              if (rawVendor) {
                user = {
                  ...rawVendor,
                  _id: rawVendor._id.toString(),
                };
                role = 'vendor';
              }
            }

          if (!user) {
              throw new CustomError("User not found",StatusCodes.NOT_FOUND);
          } 

          const resetToken = this._tokenService.generateResetToken(email);
            try {
			       await this._redisTokenRepository.storeResetToken(email,resetToken);
		        } catch (error) {
		        	console.error("Failed to store reset token in Redis:", error);
		         	throw new CustomError("Failed to store reset token", StatusCodes.INTERNAL_SERVER_ERROR);
		       }
        // const rolePrefix = role !== "client" ? `/${role}` : "";
		const resetUrl = new URL(
			`/reset-password/${resetToken}`,
			config.CORS_ORIGIN
		).toString();

    console.log(email,role);
		await this._emailService.sendResetEmail(
			email,
			"BookMyDesk - Reset your password",
			resetUrl
		);
   }
}