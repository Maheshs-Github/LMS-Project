import z from "zod";

const getAllCoursesSchema = z.object({
  query: z
    .object({
      searchValue: z.string().trim().optional(),
      sortBy: z.enum(["price-low", "price-high", "rating", ""]).optional(),
      category: z.string().trim().optional(),

      page: z.coerce.number().int().positive().default(1),

      limit: z.coerce.number().int().positive().max(100).default(10),
    })
    .strict(),
});

const createCourseSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),

      subTitle: z
        .string()
        .trim()
        .min(3, "Subtitle must be at least 3 characters")
        .max(200, "Subtitle cannot exceed 200 characters"),

      category: z.string().trim().min(2, "Category is required"),

      level: z.enum(
        ["Beginner", "Moderate", "Advance"],
        "Invalid course level",
      ),

      price: z.coerce.number().nonnegative("Price cannot be negative"),

      description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters"),
    })
    .strict(),
});

const updateCourseSchema = z.object({
  params: z.object({
    courseId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),

  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters")
        .optional(),

      subTitle: z
        .string()
        .trim()
        .min(3, "Subtitle must be at least 3 characters")
        .max(200, "Subtitle cannot exceed 200 characters")
        .optional(),

      category: z
        .string()
        .trim()
        .min(2, "Category is required")
        .optional(),

      level: z
        .enum(
          ["Beginner", "Moderate", "Advance"],
          "Invalid course level"
        )
        .optional(),

      price: z
        .coerce
        .number()
        .nonnegative("Price cannot be negative")
        .optional(),

      description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .optional(),
    })
    .strict(),
});

export { getAllCoursesSchema,createCourseSchema, updateCourseSchema};
