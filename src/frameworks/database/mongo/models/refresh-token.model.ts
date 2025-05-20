import { model, ObjectId } from "mongoose";
import { IRefreshTokenEntity } from "../../../../entities/models/refresh-token.entity";
import { refreshTokenSchema } from "../schemas/refresh-token.schema";

export interface IRefreshTokenModel extends IRefreshTokenEntity,Document{
    _id:ObjectId;
}

export const RefreshTokenModel = model<IRefreshTokenModel>("RefreshToken", refreshTokenSchema);