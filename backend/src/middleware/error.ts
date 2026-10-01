import { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { HTTPResponseError } from "hono/types"

export const notFound = async (c: Context) => {
    const currentPath = c.req.path
    return c.json({ message: `The route '${currentPath}' was not found` }, 404)
}

export const errorHandler = async (err: Error | HTTPResponseError, c: Context) => {
    if (err instanceof HTTPException) {
        return err.getResponse()
    }

    return c.json({ error: err.message }, 500)
}
