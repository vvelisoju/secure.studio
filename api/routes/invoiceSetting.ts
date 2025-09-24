import { Router } from "express";
import { invoiceSettingsController } from "../controllers/invoiceSetting";

const router = Router();

router.get("/", invoiceSettingsController.getSettings);
router.put("/", invoiceSettingsController.updateSettings);

export default router;
