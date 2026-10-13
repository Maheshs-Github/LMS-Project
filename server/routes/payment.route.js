import { Router } from "express";

import {
  createOrder,
  failurePayment,
  getPaymentStatus,
} from "../controllres/payment.controller.js";

import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { createOrderSchema, failurePaymentSchema, getPaymentStatusSchema } from "../validators/payment.schema.js";
import { validate } from "../middlewares/validate.middlewares.js";

const router = Router();

router.post("/create-order", verifiedUser,validate(createOrderSchema), createOrder);
router.get("/status/:orderId", verifiedUser, validate(getPaymentStatusSchema),getPaymentStatus);
router.post("/failure", verifiedUser, validate(failurePaymentSchema), failurePayment);

export default router;
