import { inject, injectable } from "tsyringe";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { JwtPayload } from "jsonwebtoken";
import { IRefreshTokenUseCase } from "../../entities/usecaseInterfaces/auth/refresh-token-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @inject("IJwtService")
    private _tokenService: IJwtService,

  ){}
    execute(refreshToken: string): { role: string; accessToken: string } {
		const payload = this._tokenService.verifyRefreshToken(refreshToken);
		if (!payload) {
			throw new CustomError('Invalid refresh token',StatusCodes.BAD_REQUEST);
		}
		return {
			role: (payload as JwtPayload).role,
			accessToken: this._tokenService.generateAccessToken({
				userId: (payload as JwtPayload).userId,
				email: (payload as JwtPayload).email,
				role: (payload as JwtPayload).role,
			}),
		};
	}
}