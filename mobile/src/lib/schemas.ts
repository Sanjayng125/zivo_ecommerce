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

export const AddressSchema = z.object({
    full_name: z.string({ message: "Invalid full name" }).min(3, "Name must be at least 3 characters").max(50, "Name must be at most 50 characters").trim(),
    phone: z
        .string({
            error: "Phone number must be a text value"
        })
        .trim()
        .regex(
            /^\+?[1-9]\d{7,14}$/,
            "Please enter a valid phone number"
        ),
    line1: z.string({ message: "Invalid line 1" }).min(3, "Line 1 must be at least 3 characters").max(50, "Line 1 must be at most 50 characters").trim(),
    line2: z.string({ message: "Invalid line 2" }).min(3, "Line 2 must be at least 3 characters").max(50, "Line 2 must be at most 50 characters").trim().optional(),
    city: z.string({ message: "Invalid city" }).min(3, "City must be at least 3 characters").max(50, "City must be at most 50 characters").trim(),
    state: z.string({ message: "Invalid state" }).min(3, "State must be at least 3 characters").max(50, "State must be at most 50 characters").trim(),
    pincode: z
        .string({
            error: "Postal code must be a text value"
        })
        .trim()
        .regex(
            /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/,
            "Please enter a valid postal code"
        ),
    is_default: z.boolean({ message: "Invalid default address" }).default(false),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type ReviewSchemaType = z.infer<typeof ReviewSchema>;
export type AddressSchemaType = z.infer<typeof AddressSchema>;
