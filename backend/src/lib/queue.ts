import { Queue } from 'bullmq';
import { ioRedisConnection } from './redis.js';

export const paymentsQueue = new Queue('payments', {
    connection: ioRedisConnection,
    prefix: 'payments',
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        },
        delay: 2000 // waits for 2 seconds before processing the job
    }
});
