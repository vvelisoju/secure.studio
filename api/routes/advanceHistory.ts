import { Router } from "express";
import { advanceHistoryController } from "../controllers/advanceHistory";

const router: Router = Router();
router.get("/", advanceHistoryController.getUserAdvanceHistory);
router.post("/", advanceHistoryController.createAdvanceHistory);
router.put("/", advanceHistoryController.update);

export default router;
