import { injectable } from "tsyringe";
import { IRefreshTokenModel, RefreshTokenModel } from "../../../frameworks/database/mongo/models/refresh-token.model";
import { BaseRepository } from "../base.repository";


injectable()
export class RefreshTokenRepository extends BaseRepository<IRefreshTokenModel> {
    constructor() {
        super(RefreshTokenModel);
    }
    
   async revokeRefreshToken(token: string): Promise<void> {
		await RefreshTokenModel.deleteOne({ token });
	}
    
}