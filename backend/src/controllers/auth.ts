import { Context } from "hono";
import { auth } from "../lib/auth.js";

export const adminSignIn = async (c: Context) => {
    const { email, password } = await c.req.json();

    const res = await auth.api.signInEmail({
        body: { email, password },
        headers: c.req.raw.headers,
        asResponse: true,
    });

    const data = await res.json();

    if (!data.user) {
        return c.json({ message: "Invalid credentials" }, 401);
    }

    if (data.user.role !== "admin") {
        await auth.api.revokeSession({
            headers: c.req.raw.headers,
            body: { token: data.token },
        });
        return c.json({ message: "Access denied" }, 403);
    }

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) c.header("Set-Cookie", setCookie);

    return c.json({ user: data.user });
}

export const getSession = async (c: Context) => {
    const user = c.get("user")

    return c.json({ user })
}

export const signOut = async (c: Context) => {
    const token = c.get("session")?.token

    const res = await auth.api.signOut({
        headers: c.req.raw.headers,
        asResponse: true,
    });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) c.header("Set-Cookie", setCookie);

    if (token) {
        await auth.api.revokeSession({ headers: c.req.raw.headers, body: { token } });
    }

    return c.json({ message: "Signed out" });
}
