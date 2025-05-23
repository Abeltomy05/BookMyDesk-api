import { inject, injectable } from "tsyringe";
import { IRedisTokenRepository } from "../../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { redisClient } from "../../../frameworks/cache/redis.client";


@injectable()
export class RedisTokenRepository implements IRedisTokenRepository {
  
    async blackListToken(token: string, expiresIn: number): Promise<void> {
		await redisClient.set(token, "blacklisted", { EX: expiresIn });
	}
  
    async isTokenBlackListed(token: string): Promise<boolean> {
		const result = await redisClient.get(token);
		return result === "blacklisted";
	}

    // Reset Token
    async storeResetToken(email: string, token: string): Promise<void> {
        await redisClient.setEx(`reset:${token}`, 300, email);
    }

    async verifyResetToken(token: string, email: string): Promise<boolean> {
        const storedEmail = await redisClient.get(`reset:${token}`);
        return storedEmail === email;
    }

    async deleteResetToken(token: string): Promise<void> {
        await redisClient.del(`reset:${token}`);
    }


}