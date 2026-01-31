import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Only initialize Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.SERVER_BASE_URL) {
    const callbackURL = process.env.SERVER_BASE_URL + "/api/auth/google/callback";
    console.log("✅ Google OAuth initialized");
    console.log("📍 Callback URL:", callbackURL);
    console.log("🔑 Client ID:", process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...");
    
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                callbackURL: callbackURL,
            },
            function (accessToken, refreshToken, profile, cb) {
                console.log("🎯 Google OAuth callback received for:", profile.emails?.[0]?.value);
                // Ignore accessToken as we use JWT.
                return cb(null, profile); // 👈 Required! This sets req.user
            }
        )
    );
} else {
    console.warn("⚠️  Google OAuth not configured");
    console.warn("   GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing");
    console.warn("   GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing");
    console.warn("   SERVER_BASE_URL:", process.env.SERVER_BASE_URL ? "✅ Set" : "❌ Missing");
}


