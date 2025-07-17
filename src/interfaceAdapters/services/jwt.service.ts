import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { injectable } from "tsyringe";
import { config } from "../../shared/config";

export interface ResetTokenPayload extends JwtPayload {
	email: string;
}

@injectable()
export class JwtService implements IJwtService {
    private _resetTokenSecret: Secret;

    constructor(){
        if (!config.RESET_TOKEN_SECRET) {
            throw new Error("RESET_TOKEN_SECRET is not defined in environment variables");
        }
        this._resetTokenSecret = config.RESET_TOKEN_SECRET
    }

    generateResetToken(email: string): string {
        const payload: ResetTokenPayload = { email };
        const token = jwt.sign(payload, this._resetTokenSecret, {
            expiresIn: "5m",
        });
        return token;
    }

    verifyResetToken(token: string): ResetTokenPayload | null {
		try {
			const payload = jwt.verify(token, this._resetTokenSecret) as ResetTokenPayload;
            return payload;
		} catch (error) {
			console.error("Reset token verification failed:", error);
			return null;
		}
	}

    generateAccessToken(payload: object): string {
        const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET!, {
            expiresIn: "15m",
        });
        return accessToken;
    }

    generateRefreshToken(payload: object): string {
        const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET!, {
            expiresIn: "7d",
        });
        return refreshToken;
    }

    verifyAccessToken(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(token, config.ACCESS_TOKEN_SECRET!) as JwtPayload;
            return payload;
        } catch (error) {
            console.error("Access token verification failed:", error);
            return null;
        }
    }

    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(token, config.REFRESH_TOKEN_SECRET!) as JwtPayload;
            // console.log("Refresh Token Payload:", payload);
            return payload;
        } catch (error) {
            console.error("Refresh token verification failed:", error);
            return null;
        }
    }

    decodeAccessToken(token: string): JwtPayload | null {
        try {
            const payload = jwt.decode(token) as JwtPayload;
            return payload;
        } catch (error) {
            console.error("Token decoding failed:", error);
            return null;
        }
    }
}