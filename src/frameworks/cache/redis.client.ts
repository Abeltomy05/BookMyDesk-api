import { createClient } from "redis";

export const redisClient = createClient({
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASS,
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT || "6379" ),
	},
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
    await redisClient.connect();
    console.log("\t|         📦 Redis connected successfully!            |");
})();