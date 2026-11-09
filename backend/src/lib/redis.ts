import { Redis } from "@upstash/redis";
import { Redis as IORedis } from 'ioredis';

export const upstashRedis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

function createBullMQConnection() {
    return new IORedis(process.env.RAILWAY_REDIS_URL!, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy(times) {
            return Math.min(times * 500, 2000);
        },
    });
}

export const queueRedis = createBullMQConnection();
export const workerRedis = createBullMQConnection();
