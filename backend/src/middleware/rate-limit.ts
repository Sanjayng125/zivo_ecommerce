import { Context } from "hono";
import { rateLimiter } from "hono-rate-limiter";
// import { RedisStore} from "hono-rate-limiter";
import { HonoVariables } from "../types/index.js";


export const authRateLimit = rateLimiter({
    // pass redis client to store for all rate limiters if you want to use redis
    // store: new RedisStore({
    //     client: redisClient, // your redis client
    //     prefix: "auth-rate-limit",
    // }),
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 10,
    keyGenerator(c: Context) {
        const ip = c.req.header("x-forwarded-for")?.split(",")[0].trim() ?? ""
        return ip
    },
})

export const publicRateLimit = rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 100,
    keyGenerator(c: Context) {
        const ip = c.req.header("x-forwarded-for")?.split(",")[0].trim() ?? ""
        return ip
    },
})

export const protectedRateLimit = rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 200,
    keyGenerator(c: Context<{ Variables: HonoVariables }>) {
        const user = c.get("user")
        const ip = c.req.header("x-forwarded-for")?.split(",")[0].trim() ?? ""
        return user?.id ?? ip
    },
})

export const adminRateLimit = rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 300,
    keyGenerator(c: Context<{ Variables: HonoVariables }>) {
        const user = c.get("user")
        const ip = c.req.header("x-forwarded-for")?.split(",")[0].trim() ?? ""
        return user?.id ?? ip
    },
})

