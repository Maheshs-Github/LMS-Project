import Router from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { getInstructorDashboard } from "../controllres/dashboard.controller.js";

const router=Router();

router.use(verifiedUser);

router.get("/instructor",getInstructorDashboard);

export default router;