import { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { HTTPResponseError } from "hono/types"
import { ContentfulStatusCode } from "hono/utils/http-status"

export const notFound = async (c: Context) => {
    const currentPath = c.req.path
    return c.json({ message: `The route '${currentPath}' was not found` }, 404)
}

export const errorHandler = async (err: Error | HTTPResponseError, c: Context) => {
    if (err instanceof HTTPException) {
        const statusCode = err.getResponse().status as ContentfulStatusCode
        return c.json(
            { message: err.message },
            statusCode
        )
    }

    if (err instanceof SyntaxError) {
        return c.json(
            { message: "Invalid Request" },
            400
        )
    }

    console.log(err)
    return c.json({ message: "Something went wrong on our side" }, 500)
}
