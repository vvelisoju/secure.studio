import { Router } from "express";
import { authController } from "../controllers/auth";
import passport from "passport";
const router = Router();

// Google Auth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], }));
router.get("/google/callback", passport.authenticate("google", { session: false }), authController.googleAuth);

// Normal Auth Routes
router.post("/send-otp", authController.sendOtp);
router.post("/resend-otp", authController.resendOTP);
router.post("/verify-otp", authController.verifyOtp);
router.post("/refreshToken", authController.refreshToken);
export default router;
