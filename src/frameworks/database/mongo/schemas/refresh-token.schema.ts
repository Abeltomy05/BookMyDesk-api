import { Schema } from "mongoose";
import { IRefreshTokenModel } from "../models/refresh-token.model";

export const refreshTokenSchema = new Schema<IRefreshTokenModel>({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userType: {
        type: String,
        enum: ["admin", "client", "vendor"],
        required: true,
    },
    expiresAt: {
        type: Date,
		required: true,
		expires: 604800, // 7 days
    },
}, { timestamps: true
})