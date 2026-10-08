import { z } from "zod";

const uploadLectureSchema = z.object({
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
        .min(1, "Lecture title is required")
        .max(150, "Lecture title cannot exceed 150 characters"),
    })
    .strict(),
});

const updateLectureSchema = z.object({
  params: z.object({
    lectureId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid lecture ID"),
  }),

  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Lecture title cannot be empty")
        .max(150, "Lecture title cannot exceed 150 characters")
        .optional(),
    })
    .strict(),
});

const deleteLectureSchema = z.object({
  params: z.object({
    lectureId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid lecture ID"),
  }),
});

export {
  uploadLectureSchema,updateLectureSchema,deleteLectureSchema
};