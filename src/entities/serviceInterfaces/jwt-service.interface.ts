import { JwtPayload } from "jsonwebtoken";

export interface IJwtService{
    generateResetToken(email: string): string;
    verifyResetToken(token: string): { email: string } | null;
    generateAccessToken(payload: object): string;
    generateRefreshToken(payload: object): string;
    verifyAccessToken(token: string): JwtPayload | null ;
    verifyRefreshToken(token: string): JwtPayload | null ;
    decodeAccessToken(token: string): JwtPayload | null ;
}