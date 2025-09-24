import { Router } from "express";
import { notificationScheduleController } from "../controllers/notificationSchedule";

const router = Router();

router.get("/", notificationScheduleController.getAllNotificationSchedules);
router.put("/", notificationScheduleController.updateNotificationSchedule);

export default router;
