import { Router } from "express";
import { meetingRoomSettingController } from "../controllers/meetingRoomSetting";

const router = Router();

router.get("/admin", meetingRoomSettingController.getMeetingRoomSettings);
router.put("/admin", meetingRoomSettingController.updateMeetingRoomSettings);

export default router;
