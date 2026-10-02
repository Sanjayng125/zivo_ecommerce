import { HTTPException } from "hono/http-exception";
import z from "zod";

export const customValidationHandler = (
    result: { success: boolean; error?: z.z.core.$ZodError }
) => {
    if (!result.success) {
        const message = result.error?.issues
            .map(i => `${i.path.join(".")}: ${i.message}`)
            .join(", ")

        throw new HTTPException(400, {
            message: message ?? "Validation failed"
        })
    }
}
