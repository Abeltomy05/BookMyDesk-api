import { inject, injectable } from "tsyringe";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { ISendOtpUseCase } from "../../entities/usecaseInterfaces/auth/send-otp-usecase.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";

@injectable()
export class SendOtpUseCase implements ISendOtpUseCase {
    constructor(
        @inject("IUserExistenceService")
            private  _userExistenceService: IUserExistenceService,
        @inject("IOtpService")
           private _otpService: IOtpService, 
        @inject("IOtpBcrypt")
            private _otpBcrypt: IBcrypt,
        @inject("IEmailService")
              private _emailService: IEmailService          
    ){}

     async execute(email: string): Promise<void> {
          const isEmailExisting = await this._userExistenceService.emailExists(email);
          if (isEmailExisting) {
               console.log("Email already exists:", email);
               const error = new Error("Email already exists");
               error.name = "EmailExistsError";
               throw error;
          }

          const otp = this._otpService.generateOtp();
          const hashedOtp = await this._otpBcrypt.hash(otp);
          await this._otpService.storeOtp(email, hashedOtp);

          await this._emailService.sendOtp(email,"BookMyDesk - Verify Your Email" ,otp);
     }
}