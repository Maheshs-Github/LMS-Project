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

export { toggleBlockStatusSchema,updateCourseStatusSchema };