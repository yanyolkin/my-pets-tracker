const Redis = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST || "redis",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    lazyConnect: true,
});

const connectRedis = async () => {
    try {
        await redis.connect();
        console.log("🚀 [Redis] Успешно подключен и готов к работе");
    } catch (error) {
        throw new Error(`Не удалось подключиться к Redis: ${error.message}`);
    }
};

module.exports = {
    redis,
    connectRedis,
};
