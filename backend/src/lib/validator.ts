import { HTTPException } from "hono/http-exception";
import z from "zod";

export const customValidationHandler = (
    result: { success: boolean; error?: z.z.core.$ZodError }
) => {
    if (!result.success) {
        const fields = [
            ...new Set(
                result.error?.issues
                    .map(i => i.path.join("."))
                    .filter(Boolean)
            )
        ]

        throw new HTTPException(400, {
            message: fields.length > 0
                ? `Invalid ${fields.join(", ")}`
                : "Validation failed"
        })
    }
}
