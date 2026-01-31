import { Router } from "express";
import { authController } from "../controllers/auth";
import passport from "passport";
const router = Router();

// Google Auth Routes (only enabled if credentials are configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.SERVER_BASE_URL) {
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], }));
  router.get("/google/callback", passport.authenticate("google", { session: false }), authController.googleAuth);
} else {
  // Provide helpful error message when Google OAuth is not configured
  router.get("/google", (req, res) => {
    res.status(503).json({ 
      error: "Google OAuth not configured", 
      message: "Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and SERVER_BASE_URL in .env file" 
    });
  });
}

// Normal Auth Routes
router.post("/send-otp", authController.sendOtp);
router.post("/resend-otp", authController.resendOTP);
router.post("/verify-otp", authController.verifyOtp);
router.post("/refreshToken", authController.refreshToken);
export default router;
