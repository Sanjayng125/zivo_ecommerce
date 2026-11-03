import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const cronSecretMiddleware = async (c: Context, next: Next) => {
    const secret = c.req.header("x-cron-secret")

    if (!secret || secret !== process.env.CRON_SECRET) {
        throw new HTTPException(401, {
            message: "Unauthorized"
        });
    }

    await next();
};
