import { z } from "zod";

const addLectureProgressSchema = z.object({
  params: z.object({
    courseId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),

    lectureId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid lecture ID"),
  }),
});

export {
  addLectureProgressSchema,
};