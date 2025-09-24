import { Router } from "express";
import { supportController } from "../controllers/support";
const router = Router();
router.post("/getInTouch", supportController.getInTouch);


export default router;
