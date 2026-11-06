import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import pool from "../db/client.js";
import resend from "../services/resend.js";

export const auth = betterAuth({
    database: pool,
    trustedOrigins: [
        "zivo://",
    ],
    plugins: [
        admin()
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }) => {

            const params = new URLSearchParams({
                token,
                callbackURL: "zivo://(auth)/sign-in",
            });

            const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?${params}`

            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "Verify your Zivo account",
                html: `<p>Hi ${user.name},</p><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
            })
        },
        sendOnSignUp: true,
        sendOnSignIn: true,
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
