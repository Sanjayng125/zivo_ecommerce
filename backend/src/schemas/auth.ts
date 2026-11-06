import z from "zod";

export const adminSignInSchema = z.object({
    email: z.email({ error: "Invalid email" }),
    password: z.string()
        .min(6, "Password should be atleast 6 characters long")
        .max(255, { error: "Password can be atmost of 255 characters long" }),
})

