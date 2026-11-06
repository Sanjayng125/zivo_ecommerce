import { AuthUser } from "@/types";
import { authClient } from "../auth-client";

export interface LoginPayload {
    email: string;
    password: string;
}

export const authApi = {
    login: async (payload: LoginPayload) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/admin/sign-in`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            }
        );

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err?.message ?? "Login failed");
        }

        return res.json() as Promise<AuthUser>;
    },

    me: async () => {
        const { data } = await authClient.getSession();
        return data?.user ?? null;
    },

    logout: async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/sign-out`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            }
        );

        return await res.json()
    },
};
