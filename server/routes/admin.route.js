import {Router} from "express";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import { getAdminDashboard, getAllCourses, getCourseDetails, getRecentActivity, getUser, getUsers, toggleBlockStatus, updateCourseStatus } from "../controllres/admin.controller.js";


const router=Router();

router.get("/dashboard",isAdmin,getAdminDashboard)
router.get("/dashboard/recent-activity",isAdmin,getRecentActivity)
router.get("/users",isAdmin,getUsers)
router.get("/users/:userId",isAdmin,getUser)
router.patch("/toggle-block", isAdmin, toggleBlockStatus);
router.get("/courses",isAdmin,getAllCourses)
router.get("/courses/:courseId",isAdmin,getCourseDetails);
router.patch("/courses/:courseId",isAdmin,updateCourseStatus);



export default router;