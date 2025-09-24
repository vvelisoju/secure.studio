import { Router } from "express";
import { paymentController } from "../controllers/payment";

const router = Router();
router.post("/meeting-room/create-order", paymentController.createOrderForMeetingRoom);
router.post("/create-order", paymentController.createOrder);
router.post("/cancel-order", paymentController.cancelOrder);
router.post("/payment-failed", paymentController.paymentFail);
router.post("/offline", paymentController.offline);
export default router;
