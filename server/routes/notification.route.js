import {Router} from "express"
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { getMyNotifications, markAllAsRead, markAsRead } from "../controllres/notification.controller.js";

const router=Router();

router.use(verifiedUser)

router.get("/",getMyNotifications);
router.patch("mark-as-read",markAsRead);
router.patch("/mark-all-as-read",markAllAsRead)

export default router;
