import { Router } from "express";
import { createOrder, failurePayment, verifyPayment } from "../controllres/payment.controller.js";
import { verifiedUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/create-order", verifiedUser, createOrder);
router.post("/verify", verifiedUser, verifyPayment);
router.post("/failure", verifiedUser, failurePayment);



export default router;