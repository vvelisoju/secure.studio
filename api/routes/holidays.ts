// routes/holidays.ts
import { Router } from "express";
import { holidayController } from "../controllers/holidays";

const router: Router = Router();

router.get("/holidays", holidayController.getAllHolidays);
router.get("/holidays/:id", holidayController.getHolidayById);
router.post("/holidays", holidayController.createHoliday);
router.put("/holidays/:id", holidayController.updateHoliday);
router.delete("/holidays/:id", holidayController.deleteHoliday);

export default router;