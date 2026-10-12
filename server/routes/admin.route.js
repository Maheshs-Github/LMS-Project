import {Router} from "express";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import { getAdminDashboard, getAllCourses, getCourseDetails, getRecentActivity, getUser, getUsers, toggleBlockStatus, updateCourseStatus } from "../controllres/admin.controller.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { toggleBlockStatusSchema, updateCourseStatusSchema } from "../validators/admin.schema.js";


const router=Router();

router.get("/dashboard",isAdmin,getAdminDashboard)
router.get("/dashboard/recent-activity",isAdmin,getRecentActivity)
router.get("/users",isAdmin,getUsers)
router.get("/users/:userId",isAdmin,getUser)
router.patch("/toggle-block", isAdmin,  validate(toggleBlockStatusSchema), toggleBlockStatus);
router.get("/courses",isAdmin,getAllCourses)
router.get("/courses/:courseId",isAdmin,getCourseDetails);
router.patch("/courses/:courseId",isAdmin,validate(updateCourseStatusSchema),updateCourseStatus);



export default router;