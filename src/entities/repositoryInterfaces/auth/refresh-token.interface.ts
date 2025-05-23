import { IRefreshTokenEntity } from "../../models/refresh-token.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IRefreshTokenRepository extends IBaseRepository<IRefreshTokenEntity>{
    revokeRefreshToken(token: string): Promise<void>
}