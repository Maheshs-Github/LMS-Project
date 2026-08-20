import {Router} from "express";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import { getAdminDashboard, getAllCourses, getRecentActivity, getUser, getUsers, toggleBlockStatus } from "../controllres/admin.controller.js";


const router=Router();

router.get("/dashboard",isAdmin,getAdminDashboard)
router.get("/dashboard/recent-activity",isAdmin,getRecentActivity)
router.get("/users",isAdmin,getUsers)
router.get("/users/:userId",isAdmin,getUser)
router.patch("/toggle-block", isAdmin, toggleBlockStatus);
router.get("/courses",isAdmin,getAllCourses)


export default router;