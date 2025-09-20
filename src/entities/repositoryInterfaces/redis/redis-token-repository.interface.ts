export interface IRedisTokenRepository {
    storeResetToken(email: string, token: string): Promise<void>;
    verifyResetToken(token: string, email: string): Promise<boolean>;
    deleteResetToken(token: string): Promise<void>;
    isTokenBlackListed(token: string): Promise<boolean>; 
    blackListToken(token: string, expiresIn: number): Promise<void>; 
    acquireLock(key: string, ttlMs: number): Promise<string | null>;
    releaseLock(key: string, lockId: string): Promise<void>;
    markEmailAsVerified(email: string): Promise<void>;
    isEmailVerified(email: string): Promise<boolean> 
}