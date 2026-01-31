import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Only initialize Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.SERVER_BASE_URL) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                callbackURL: process.env.SERVER_BASE_URL + "/api/auth/google/callback",
            },
            function (accessToken, refreshToken, profile, cb) {
                // Ignore accessToken as we use JWT.
                return cb(null, profile); // 👈 Required! This sets req.user
            }
        )
    );
} else {
    console.warn("⚠️  Google OAuth not configured - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or SERVER_BASE_URL missing");
}


