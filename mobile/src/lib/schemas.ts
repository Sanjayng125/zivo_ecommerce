import { z } from "zod";

export const SignInSchema = z.object({
    email: z.email({ message: "Invalid email" }),
    password: z.string({ message: "Invalid password" }).min(8, "Password must be at least 8 characters").max(20, "Password must be at most 20 characters"),
});

export const SignUpSchema = z.object({
    email: z.email({ message: "Invalid email" }),
    password: z.string({ message: "Invalid password" }).min(8, "Password must be at least 8 characters").max(20, "Password must be at most 20 characters"),
    name: z.string({ error: "Invalid full name" }).min(3, "Name must be at least 3 characters").max(50, "Name must be at most 50 characters"),
});

export const ReviewSchema = z.object({
    rating: z.number({ message: "Invalid rating" }).min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    title: z.string({ message: "Invalid title" }).min(3, "Title must be at least 3 characters").max(50, "Title must be at most 50 characters").trim(),
    comment: z.string({ message: "Invalid comment" }).min(10, "Comment must be at least 10 characters").max(500, "Comment must be at most 500 characters").trim().optional(),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type ReviewSchemaType = z.infer<typeof ReviewSchema>;
