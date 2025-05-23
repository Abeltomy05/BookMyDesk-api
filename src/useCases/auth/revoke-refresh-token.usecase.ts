import { inject, injectable } from "tsyringe";
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/auth/refresh-token.interface";
import { IRevokeRefreshTokenUseCase } from "../../entities/usecaseInterfaces/auth/revoke-refreshtoken-usecase.interface";

@injectable()
export class RevokeRefreshTokenUseCase implements IRevokeRefreshTokenUseCase {
	constructor(
		@inject("IRefreshTokenRepository")
		private _refreshTokenRepository: IRefreshTokenRepository
	) {}
	async execute(token: string): Promise<void> {
		await this._refreshTokenRepository.revokeRefreshToken(token);
	}
}