import { inject, injectable } from "tsyringe";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { JwtPayload } from "jsonwebtoken";
import { IBlackListTokenUseCase } from "../../entities/usecaseInterfaces/auth/blacklist-token-usecase.interface";

@injectable()
export class BlackListTokenUseCase implements IBlackListTokenUseCase {
	constructor(
		@inject("IRedisTokenRepository")
		private _redisTokenRepository: IRedisTokenRepository,
		@inject("IJwtService") private _tokenService: IJwtService
	) {}
	async execute(token: string): Promise<void> {
		const decoded: string | JwtPayload | null = this._tokenService.verifyAccessToken(token);

		if (!decoded || typeof decoded === "string" || !decoded.exp) {
			throw new Error("Invalid Token: Missing expiration time");
		}

		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
		if (expiresIn > 0) {
			await this._redisTokenRepository.blackListToken(token, expiresIn);
		}
	}
}