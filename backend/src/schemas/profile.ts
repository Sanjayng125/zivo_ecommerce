import z from "zod"

export const profileUpdateSchema = z.object({
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
})

export const avatarUpdateSchema = z.object({
    avatar_url: z.url({
        error: "Please enter a valid avatar URL"
    }),
})
