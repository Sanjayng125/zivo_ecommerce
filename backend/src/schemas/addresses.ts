import z from "zod"

export const addressSchema = z.object({
    full_name: z
        .string({
            error: "Full name must be a text value"
        })
        .trim()
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name must be at most 100 characters"),
    phone: z
        .string({
            error: "Phone number must be a text value"
        })
        .trim()
        .regex(
            /^\+?[1-9]\d{7,14}$/,
            "Please enter a valid phone number"
        ),
    line1: z
        .string({
            error: "Address must be a text value"
        })
        .trim()
        .min(3, "Address must be at least 3 characters")
        .max(500, "Address must be at most 500 characters"),
    line2: z
        .string({
            error: "Address line 2 must be a text value"
        })
        .trim()
        .max(500, "Address line 2 must be at most 500 characters")
        .optional(),
    city: z
        .string({
            error: "City must be a text value"
        })
        .trim()
        .min(2, "City must be at least 2 characters")
        .max(100, "City must be at most 100 characters"),
    state: z
        .string({
            error: "State must be a text value"
        })
        .trim()
        .min(2, "State must be at least 2 characters")
        .max(100, "State must be at most 100 characters"),
    pincode: z
        .string({
            error: "Postal code must be a text value"
        })
        .trim()
        .regex(
            /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/,
            "Please enter a valid postal code"
        ),
    is_default: z
        .coerce
        .boolean({
            error: "Default address must be true or false"
        })
        .default(false),
})
