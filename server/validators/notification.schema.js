import { z } from "zod";

const markAsReadSchema = z.object({
  params: z.object({
    notificationId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid notification ID"),
  }),
});

export { markAsReadSchema };