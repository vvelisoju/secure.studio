import { Router } from "express";
import { dashboardController } from "../controllers/dashboard"
const router = Router();

router.get("/", dashboardController.getAllDashboardsDetailsUser);
router.get("/admin", dashboardController.getAllDashboardsDetailsAdmin);

export default router;
