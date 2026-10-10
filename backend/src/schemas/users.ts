import z from "zod";

export const getUsersSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(0).default(10),
    sort: z.enum(["newest", "oldest", "name_asc", "name_desc"]).optional().default("newest"),
    q: z.string().trim().optional(),
    role: z.enum(["user", "admin"]).optional(),
})

export const updateUserRoleSchema = z.object({
    role: z.enum(["user", "admin"]),
})
