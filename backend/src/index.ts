import { serve } from '@hono/node-server';
import 'dotenv/config';
import { validateEnv } from './lib/env.js';

const start = async () => {
    try {
        validateEnv();

        const { default: app } = await import('./app.js');

        const PORT = Number(process.env.PORT ?? "3000");

        serve({ fetch: app.fetch, port: PORT }, (info) => {
            console.log(`Server is running on port: ${info.port ?? 3000}`);
        });
    } catch (error) {
        console.error("Failed to start server:\n", error);
        process.exitCode = 1;
    }
};

start();
