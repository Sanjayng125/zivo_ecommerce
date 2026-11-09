import { Queue } from 'bullmq';
import { queueRedis } from './redis.js';

export const paymentsQueue = new Queue('payments', {
    connection: queueRedis,
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
