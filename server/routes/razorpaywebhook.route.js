import {Router} from "express"
import { handleRazorpayWebhook } from "../controllres/payment.controller.js";

const router=Router();

router.post("/",handleRazorpayWebhook);

export default router;