import { z } from "zod";

const getCourseChatMessagesSchema = z.object({
  params: z.object({
    courseId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),
});

const writeMessageSchema = z.object({
  params: z.object({
    courseId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),

  body: z
    .object({
      content: z
        .string()
        .trim()
        .min(1, "Message content is required")
        .max(5000, "Message cannot exceed 5000 characters"),
    })
    .strict(),
});

export {
  getCourseChatMessagesSchema,
  writeMessageSchema,
};