import { Context } from "hono";

export const getHealth = (c: Context) => {
    const uptime = process.uptime();

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const since = [
        days,
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');

    return c.json({
        status: 'ok',
        uptime: Math.floor(uptime),
        since,
        timestamp: Date.now(),
        timestamp_iso: new Date().toISOString()
    });
}
