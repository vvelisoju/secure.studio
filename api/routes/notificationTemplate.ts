import { Router } from "express";
import { notificationTemplateController } from "../controllers/notificationTemplate";

const router = Router();

router.get("/schedulable", notificationTemplateController.getAllSchedulableTemplates);

export default router;
