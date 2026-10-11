import 'dotenv/config';

import { serve } from '@hono/node-server';
import app from './app.js';
import { validateEnv } from './lib/env.js';

const start = () => {
    try {
        validateEnv();

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
