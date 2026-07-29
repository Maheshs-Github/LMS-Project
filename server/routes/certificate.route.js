import { Router } from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { downloadCertificate } from "../controllres/certificate.controller.js";

const router = Router();

router.get("/:courseId", verifiedUser, downloadCertificate);



export default router;