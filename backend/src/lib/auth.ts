import { betterAuth } from "better-auth";
import pool from "../db/client.js";

export const auth = betterAuth({
    database: pool,
    emailAndPassword: {
        enabled: true
    },
    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24 * 2 // 2 days
    },
    advanced: {
        disableCSRFCheck: true
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await pool.query(
                        `INSERT INTO profiles (id) VALUES ($1)`,
                        [user.id]
                    )
                }
            }
        }
    }
});
