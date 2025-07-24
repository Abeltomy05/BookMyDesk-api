import { createClient } from "redis";
import { config } from "../../shared/config";

export const redisClient = createClient({
	username: config.REDIS_USERNAME,
	password: config.REDIS_PASS,
	socket: {
		host: config.REDIS_HOST,
		port: parseInt(config.REDIS_PORT),
	},
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
    await redisClient.connect();
    console.log("\t|         📦 Redis connected successfully!            |");
})();