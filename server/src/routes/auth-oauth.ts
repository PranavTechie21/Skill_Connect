import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Router } from "express";
import { storage } from "../storage";
import bcrypt from "bcrypt";

const router = Router();

// ─── Lazy init flag ──────────────────────────────────────────────────────────
let isGoogleStrategyConfigured = false;

function ensureGoogleStrategy() {
  if (isGoogleStrategyConfigured) return;

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5002/api/auth/google/callback";

  if (!clientID || !clientSecret) {
    console.warn(
      "⚠️ Google OAuth not configured. GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing in .env"
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(
              new Error("No email found in Google profile"),
              undefined
            );
          }

          // Check if user already exists
          let user = await storage.getUserByEmail(email);

          if (user) {
            console.log("🔑 Google OAuth: Existing user found:", email);
            return done(null, user);
          }

          // User doesn't exist → create new account
          console.log("🆕 Google OAuth: Creating new user:", email);

          const randomPassword = await bcrypt.hash(
            Math.random().toString(36) + Date.now().toString(36),
            10
          );

          const newUser = await storage.createUser({
            email,
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            password: randomPassword,
            userType: "Professional",
            profilePhoto: profile.photos?.[0]?.value || null,
            location: null,
            telephoneNumber: null,
          } as any);

          // Create a professional profile for the new user
          await storage.createProfessionalProfile({
            userId: newUser.id,
            headline: null,
            bio: null,
            skills: [],
          } as any);

          console.log("✅ Google OAuth: User created:", newUser.id);
          return done(null, { ...newUser, isNewUser: true });
        } catch (error) {
          console.error("❌ Google OAuth error:", error);
          return done(error as Error, undefined);
        }
      }
    )
  );

  isGoogleStrategyConfigured = true;
  console.log("✅ Google OAuth strategy configured");
}

// ─── Serialize / Deserialize ─────────────────────────────────────────────────
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────

// Step 1: Redirect user to Google consent screen
router.get("/google", (req, res, next) => {
  // Lazy-init the strategy now (env vars are loaded by this point)
  ensureGoogleStrategy();

  if (!isGoogleStrategyConfigured) {
    return res.status(503).json({
      message:
        "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.",
    });
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

// Step 2: Google redirects back here after user grants permission
router.get("/google/callback", (req, res, next) => {
  ensureGoogleStrategy();

  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?error=google_auth_failed",
  })(req, res, (err: any) => {
    if (err) {
      console.error("❌ Google OAuth callback error:", err);
      return res.redirect("/login?error=google_auth_failed");
    }

    const user = (req as any).user;
    if (!user) {
      return res.redirect("/login?error=no_user");
    }

    // Set the session (using express-session, same as regular login)
    (req as any).session.userId = user.id.toString();
    (req as any).session.touch();

    (req as any).session.save((saveErr: any) => {
      if (saveErr) {
        console.error("❌ Error saving session after Google OAuth:", saveErr);
        return res.redirect("/login?error=session_error");
      }

      console.log("✅ Google OAuth session saved for user:", user.id);

      // Redirect based on whether user is new or existing
      if (user.isNewUser) {
        return res.redirect("/onboarding");
      }

      const userType = (user.userType || "").toLowerCase();
      if (userType === "employer") {
        return res.redirect("/employer/dashboard");
      } else if (userType === "admin") {
        return res.redirect("/admin");
      } else {
        return res.redirect("/employee/dashboard");
      }
    });
  });
});

export { passport };
export default router;

