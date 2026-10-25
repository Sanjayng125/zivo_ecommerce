import { z } from "zod";

export const SignInSchema = z.object({
    email: z.email({ message: "Invalid email" }),
    password: z.string({ message: "Invalid password" })
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters"),
});

export const SignUpSchema = z.object({
    email: z.email({ message: "Invalid email" }),
    password: z.string({ message: "Invalid password" })
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters"),
    name: z.string({ error: "Invalid full name" })
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
});

export const ReviewSchema = z.object({
    rating: z.number({ message: "Invalid rating" })
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
    title: z.string({ message: "Invalid title" }).trim()
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title must be at most 50 characters"),
    comment: z.string()
        .trim()
        .max(500, "Comment must be at most 500 characters")
        .refine(val => (val.match(/\n/g) ?? []).length <= 2, "Too many line breaks").optional()
});

export const AddressSchema = z.object({
    full_name: z.string({ message: "Invalid full name" }).trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
    phone: z
        .string({
            error: "Phone number must be a text value",
        })
        .trim()
        .regex(
            /^\+?[1-9]\d{7,14}$/,
            "Please enter a valid phone number"
        ),
    line1: z.string({ message: "Invalid line 1" }).trim()
        .refine(val => (val.match(/\n/g) ?? []).length <= 2, "Too many line breaks")
        .min(3, "Line 1 must be at least 3 characters")
        .max(50, "Line 1 must be at most 50 characters"),
    line2: z.string({ message: "Invalid line 2" }).trim()
        .refine(val => (val.match(/\n/g) ?? []).length <= 2, "Too many line breaks")
        .min(3, "Line 2 must be at least 3 characters")
        .max(50, "Line 2 must be at most 50 characters").optional(),
    city: z.string({ message: "Invalid city" }).trim()
        .min(3, "City must be at least 3 characters")
        .max(50, "City must be at most 50 characters"),
    state: z.string({ message: "Invalid state" }).trim()
        .min(3, "State must be at least 3 characters")
        .max(50, "State must be at most 50 characters"),
    pincode: z
        .string({
            error: "Postal code must be a text value"
        })
        .trim()
        .regex(
            /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/,
            "Please enter a valid postal code"
        ),
    is_default: z.boolean({ message: "Invalid default address" }),
});

export const ProfileSchema = z.object({
    full_name: z
        .string({
            error: "Full name must be a text value"
        })
        .trim()
        .min(3, "Full name must be at least 3 characters")
        .max(30, "Full name must be at most 30 characters"),

    phone: z
        .string({
            error: "Phone number must be a text value"
        })
        .trim()
        .regex(
            /^\+?[1-9]\d{7,14}$/,
            "Please enter a valid phone number"
        ),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type ReviewSchemaType = z.infer<typeof ReviewSchema>;
export type AddressSchemaType = z.infer<typeof AddressSchema>;
export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
