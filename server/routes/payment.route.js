import { Router } from "express";

import {
  createOrder,
  failurePayment,
  getPaymentStatus,
} from "../controllres/payment.controller.js";

import { verifiedUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/create-order", verifiedUser, createOrder);
router.get("/status/:orderId", verifiedUser, getPaymentStatus);
router.post("/failure", verifiedUser, failurePayment);

export default router;
