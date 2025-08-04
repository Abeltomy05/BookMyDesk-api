import {  injectable } from "tsyringe";
import { IRedisTokenRepository } from "../../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { redisClient } from "../../../frameworks/cache/redis.client";
import { v4 as uuidv4 } from 'uuid';


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

    //redis lock

    async acquireLock(key: string, ttlMs: number): Promise<string | null> {
        const lockId = uuidv4();

        const result = await redisClient.set(key, lockId, {
        NX: true,
        PX: ttlMs,
        });

        return result === "OK" ? lockId : null;
    }

    async releaseLock(key: string, lockId: string): Promise<void> {
        const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
        `;
        await redisClient.eval(luaScript, {
        keys: [key],
        arguments: [lockId],
        });
    }
}