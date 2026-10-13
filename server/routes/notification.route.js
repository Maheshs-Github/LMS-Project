import {Router} from "express"
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { getMyNotifications, markAllAsRead, markAsRead } from "../controllres/notification.controller.js";
import { markAsReadSchema } from "../validators/notification.schema.js";
import { validate } from "../middlewares/validate.middlewares.js";

const router=Router();

router.use(verifiedUser)

router.get("/",getMyNotifications);
router.patch("/mark-as-read/:notificationId",validate(markAsReadSchema),markAsRead);
router.patch("/mark-all-as-read",markAllAsRead)

export default router;
