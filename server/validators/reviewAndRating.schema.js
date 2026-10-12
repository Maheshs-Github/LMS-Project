import { z } from "zod";

const addReviewAndRatingSchema = z.object({
  params: z.object({
    courseId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),

  body: z
    .object({
      rating: z.coerce
        .number()
        .int("Rating must be a whole number")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),

      review: z
        .string()
        .trim()
        .min(1, "Review is required")
        .max(1000, "Review cannot exceed 1000 characters"),
    })
    .strict(),
});

export { addReviewAndRatingSchema };