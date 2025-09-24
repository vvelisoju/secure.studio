import { Router } from "express";
import { appSettingController } from "../controllers/appSetting";

const router = Router();

router.get("/", appSettingController.getSettings);
router.put("/", appSettingController.updateSettings);

export default router;
