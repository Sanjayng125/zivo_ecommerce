import { auth } from "../lib/auth.js"

export type HonoVariables = {
    user: typeof auth.$Infer.Session.user
    session: typeof auth.$Infer.Session.session
}
