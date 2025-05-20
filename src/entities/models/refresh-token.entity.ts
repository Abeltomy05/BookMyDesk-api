import { Schema } from "mongoose";


export interface IRefreshTokenEntity {
    token: string;
    user: Schema.Types.ObjectId;
    userType: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}