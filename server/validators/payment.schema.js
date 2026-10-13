import { z } from "zod";

const createOrderSchema = z.object({
  body: z
    .object({
      courseId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
    })
    .strict(),
});

const getPaymentStatusSchema = z.object({
  params: z.object({
    orderId: z
      .string()
      .trim()
      .min(1, "Order ID is required")
      .max(100, "Invalid order ID"),
  }),
});

const failurePaymentSchema = z.object({
  body: z
    .object({
      orderId: z
        .string()
        .trim()
        .min(1, "Order ID is required")
        .max(100, "Invalid order ID"),

      code: z.string().max(100).optional(),
      description: z.string().max(1000).optional(),
      reason: z.string().max(1000).optional(),
      source: z.string().max(100).optional(),
      step: z.string().max(100).optional(),
    })
    .strict(),
});


export { createOrderSchema, getPaymentStatusSchema, failurePaymentSchema};