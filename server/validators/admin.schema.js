import { z } from "zod";

const toggleBlockStatusSchema = z.object({
  body: z
    .object({
      userId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),

      blockStatus: z.boolean({
        error: "Block status must be a boolean",
      }),

      blockReason: z
        .string()
        .trim()
        .max(500, "Block reason cannot exceed 500 characters")
        .optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      if (data.blockStatus && !data.blockReason) {
        ctx.addIssue({
          code: "custom",
          path: ["blockReason"],
          message: "Block reason is required when blocking a user",
        });
      }
    }),
});

const updateCourseStatusSchema = z.object({
  params: z.object({
    courseId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),

  body: z
    .object({
      status: z
        .string()
        .trim()
        .toLowerCase()
        .pipe(
          z.enum(
            ["approved", "rejected"],
            "Status must be approved or rejected"
          )
        ),

      rejectedReason: z
        .string()
        .trim()
        .max(500, "Rejection reason cannot exceed 500 characters")
        .nullable()
        .optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      if (
        data.status === "rejected" &&
        !data.rejectedReason
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["rejectedReason"],
          message: "Rejection reason is required",
        });
      }
    }),
});

const getUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number()
      .int()
      .positive()
      .default(1),

    limit: z.coerce.number()
      .int()
      .positive()
      .max(100)
      .default(2),

    searchValue: z.string().trim().optional(),

    role: z.enum(["All", "student", "instructor", "admin"])
      .default("All"),

    status: z.enum(["All", "active", "blocked"])
      .default("All"),

    sortBy: z.enum(["latest", "oldest"])
      .default("latest"),
  }).strict(),
});

const getAllCoursesSchema = z.object({
  query: z
    .object({
      searchValue: z.string().trim().optional(),

      sortBy: z
        .enum(["newest", "oldest",""])
        .default("newest"),

      category: z.string().trim().optional(),

      status: z
        .enum([
          "all",
          "draft",
          "pending",
          "approved",
          "rejected",
        ])
        .default("all"),

      page: z.coerce.number().int().positive().default(1),

      limit: z.coerce.number().int().positive().max(100).default(2),
    })
    .strict(),
});

const getUserSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  }),
});

const getCourseDetailsSchema = z.object({
  params: z.object({
    courseId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),
});


export { toggleBlockStatusSchema,updateCourseStatusSchema,getUsersSchema, getAllCoursesSchema,getUserSchema,getCourseDetailsSchema};