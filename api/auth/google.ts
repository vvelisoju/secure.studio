import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

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


