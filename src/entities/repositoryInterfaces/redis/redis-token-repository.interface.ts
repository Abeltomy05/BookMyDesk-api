export interface IRedisTokenRepository {
    storeResetToken(email: string, token: string): Promise<void>;
    verifyResetToken(token: string, email: string): Promise<boolean>;
    deleteResetToken(token: string): Promise<void>;
}