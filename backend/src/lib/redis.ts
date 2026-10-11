import { Redis } from "@upstash/redis";
import { Redis as IORedis } from 'ioredis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const ioRedisConnection = new IORedis(process.env.UPSTASH_REDIS_URL!, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: {},
    retryStrategy(times) {
        return Math.min(times * 500, 2000) // retry with backoff, max 2s
    }
});

export default redis
