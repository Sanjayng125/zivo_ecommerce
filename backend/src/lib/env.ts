const requiredEnvVars = [
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "CRON_SECRET",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "UPSTASH_REDIS_URL"
] as const;

export const validateEnv = () => {
    const missing = requiredEnvVars.filter(
        (key) => !process.env[key]?.trim()
    );

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables:\n${missing
                .map((key) => `  - ${key}`)
                .join("\n")}`
        );
    }
};
