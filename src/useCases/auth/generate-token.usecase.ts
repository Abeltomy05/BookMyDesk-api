import { inject, injectable } from "tsyringe"
import { IGenerateTokenUseCase } from "../../entities/usecaseInterfaces/auth/generate-token.interface"
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface"
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/auth/refresh-token.interface";
import { Schema } from "mongoose";

@injectable()
export class GenerateTokenUseCase implements IGenerateTokenUseCase {
    constructor(
        @inject("IJwtService")
        private _tokenService: IJwtService,
        @inject("IRefreshTokenRepository")
        private _refreshTokenRepository: IRefreshTokenRepository,
    ) {}
     
    async execute(userId:Schema.Types.ObjectId, email:string, role:string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = {
            userId,
            email,
            role,
        }

        const accessToken = this._tokenService.generateAccessToken(payload)
        const refreshToken = this._tokenService.generateRefreshToken(payload)

        await this._refreshTokenRepository.save({
			token: refreshToken,
			userType: role,
			user: userId,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

        return { accessToken, refreshToken }
    }
}