import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

          role: z.enum(
      ["student", "instructor"],
      "Invalid user role"
    ),
  }).strict(),

  params: z.object({}),

  query: z.object({}),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  }),

  params: z.object({}),

  query: z.object({}),
});

export {
  registerSchema,
  loginSchema,
};