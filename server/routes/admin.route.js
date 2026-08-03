import {Router} from "express";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import { getAdminDashboard, getRecentActivity } from "../controllres/admin.controller.js";


const router=Router();

router.get("/dashboard",isAdmin,getAdminDashboard)
router.get("/dashboard/recent-activity",isAdmin,getRecentActivity)
export default router;