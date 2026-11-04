import { Context } from "hono"
import { generateUploadAuth } from "../services/imagekit.js"

export const getUploadAuth = async (c: Context) => {
    const me = c.get("user")

    const authParams = generateUploadAuth(`avatars/${me.id}`)

    return c.json({
        ...authParams
    })
}
