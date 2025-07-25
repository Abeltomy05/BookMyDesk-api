import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { IVerifyOtpUseCase } from "../../entities/usecaseInterfaces/auth/verify-otp-usecase.interface";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../entities/utils/custom.error";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
    constructor(
        @inject("IOtpService")
            private _otpService: IOtpService,
    ){}
    async execute({email,otp}:{email:string,otp:string}):Promise<void>{
            const isOtpValid = await this._otpService.verifyOtp(email, otp);
            if (!isOtpValid) {
                throw new CustomError("The OTP you entered is incorrect or has expired. Please try again or request a new OTP.", StatusCodes.BAD_REQUEST);
            }
    }
}