import { Router } from "express";
import { createOrder } from "../controllres/payment.controller.js";
import { verifiedUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/create-order", verifiedUser, createOrder);


export default router;