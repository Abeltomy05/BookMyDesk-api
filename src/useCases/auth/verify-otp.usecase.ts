import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { IVerifyOtpUseCase } from "../../entities/usecaseInterfaces/auth/verify-otp-usecase.interface";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
    constructor(
        @inject("IOtpService")
            private _otpService: IOtpService,
    ){}
    async execute({email,otp}:{email:string,otp:string}):Promise<void>{
            const isOtpValid = await this._otpService.verifyOtp(email, otp);
            if (!isOtpValid) {
                throw new CustomError(ERROR_MESSAGES.INCORRECT_OTP, StatusCodes.BAD_REQUEST);
            }
    }
}