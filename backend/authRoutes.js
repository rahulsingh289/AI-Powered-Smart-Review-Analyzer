import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "./prisma.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { requireAuth } from "./authMiddleware.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_week6_auth_and_security";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// JWT Helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Zod schemas for input validation
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// 1. POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: parseResult.error.flatten().fieldErrors 
      });
    }

    const { email, password, name } = parseResult.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash password
    const saltRounds = 11;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save to database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    });

    // Generate JWT
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        prefWeeklyReport: newUser.prefWeeklyReport,
        prefMonthlyReport: newUser.prefMonthlyReport,
        prefNegativeAlerts: newUser.prefNegativeAlerts,
        prefSecurityAlerts: newUser.prefSecurityAlerts,
        prefMarketing: newUser.prefMarketing
      }
    });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: parseResult.error.flatten().fieldErrors 
      });
    }

    const { email, password } = parseResult.data;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        prefWeeklyReport: user.prefWeeklyReport,
        prefMonthlyReport: user.prefMonthlyReport,
        prefNegativeAlerts: user.prefNegativeAlerts,
        prefSecurityAlerts: user.prefSecurityAlerts,
        prefMarketing: user.prefMarketing
      }
    });
  } catch (error) {
    next(error);
  }
});

// 3. Passport Strategies Setup (Conditional setup based on client credentials)
const hasGoogleCreds = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const backendUrl = `http://localhost:${process.env.PORT || 5001}`;

if (hasGoogleCreds) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${backendUrl}/api/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0]?.value;
      if (!email) {
        return done(new Error("No email returned from Google profile"));
      }

      let user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { email },
            data: { googleId: profile.id }
          });
        }
      } else {
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || email.split("@")[0],
            googleId: profile.id
          }
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

// 4. Google OAuth Route Handlers
router.get("/google", (req, res, next) => {
  if (hasGoogleCreds) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  } else {
    console.error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set in .env.");
    res.status(500).send(`
      <div style="font-family: sans-serif; max-width: 500px; margin: 50px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #e11d48; margin-top: 0;">Google OAuth Configuration Required</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">The Google Client ID and Secret are missing from the backend configuration.</p>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">Please configure these environment variables in your <code>backend/.env</code> file:</p>
        <pre style="background: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 13px; color: #0f172a;">GOOGLE_CLIENT_ID=your_client_id\nGOOGLE_CLIENT_SECRET=your_client_secret</pre>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">Then restart the backend server.</p>
      </div>
    `);
  }
});

router.get("/google/callback", (req, res, next) => {
  if (hasGoogleCreds) {
    passport.authenticate("google", { session: false }, (err, user) => {
      if (err || !user) {
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      }
      const token = generateToken(user);
      return res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    })(req, res, next);
  } else {
    res.status(500).json({ error: "Google OAuth credentials not configured on backend." });
  }
});

// 5. POST /api/auth/google-login (Firebase verified Google login)
router.post("/google-login", async (req, res, next) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email || !googleId) {
      return res.status(400).json({ error: "Email and Google ID are required" });
    }

    let user = await prisma.user.findUnique({ where: { googleId } });
    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        // Link Google ID to existing account
        user = await prisma.user.update({
          where: { email },
          data: { googleId }
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            name: name || email.split("@")[0],
            googleId
          }
        });
      }
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        prefWeeklyReport: user.prefWeeklyReport,
        prefMonthlyReport: user.prefMonthlyReport,
        prefNegativeAlerts: user.prefNegativeAlerts,
        prefSecurityAlerts: user.prefSecurityAlerts,
        prefMarketing: user.prefMarketing
      }
    });
  } catch (error) {
    next(error);
  }
});

// 6. PUT /api/auth/profile — Update user's profile details
router.put("/profile", requireAuth, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const updateData = {};

    if (name !== undefined) {
      if (name.trim().length < 2) {
        return res.status(400).json({ error: "Name must be at least 2 characters" });
      }
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Please provide a valid email address" });
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim() }
      });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ error: "Email is already taken by another user" });
      }
      updateData.email = email.trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone ? phone.trim() : null;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    // Generate new JWT with updated profile details
    const token = generateToken(updatedUser);

    res.status(200).json({
      message: "Profile updated successfully",
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        prefWeeklyReport: updatedUser.prefWeeklyReport,
        prefMonthlyReport: updatedUser.prefMonthlyReport,
        prefNegativeAlerts: updatedUser.prefNegativeAlerts,
        prefSecurityAlerts: updatedUser.prefSecurityAlerts,
        prefMarketing: updatedUser.prefMarketing
      }
    });
  } catch (error) {
    next(error);
  }
});

// 7. PUT /api/auth/change-password — Update password
router.put("/change-password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    // Find user in database
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !user.password) {
      return res.status(400).json({ error: "User not found or password cannot be changed (OAuth account)" });
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Hash new password
    const saltRounds = 11;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update in database
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});

// 8. DELETE /api/auth/account — Delete account permanently
router.delete("/account", requireAuth, async (req, res, next) => {
  try {
    // Delete user from database (reviews deletion cascades)
    await prisma.user.delete({
      where: { id: req.user.id }
    });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// 9. PUT /api/auth/preferences — Update user's email preferences
router.put("/preferences", requireAuth, async (req, res, next) => {
  try {
    const { 
      prefWeeklyReport, 
      prefMonthlyReport, 
      prefNegativeAlerts, 
      prefSecurityAlerts, 
      prefMarketing 
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        prefWeeklyReport: prefWeeklyReport !== undefined ? Boolean(prefWeeklyReport) : undefined,
        prefMonthlyReport: prefMonthlyReport !== undefined ? Boolean(prefMonthlyReport) : undefined,
        prefNegativeAlerts: prefNegativeAlerts !== undefined ? Boolean(prefNegativeAlerts) : undefined,
        prefSecurityAlerts: prefSecurityAlerts !== undefined ? Boolean(prefSecurityAlerts) : undefined,
        prefMarketing: prefMarketing !== undefined ? Boolean(prefMarketing) : undefined,
      }
    });

    res.status(200).json({
      message: "Preferences updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        prefWeeklyReport: updatedUser.prefWeeklyReport,
        prefMonthlyReport: updatedUser.prefMonthlyReport,
        prefNegativeAlerts: updatedUser.prefNegativeAlerts,
        prefSecurityAlerts: updatedUser.prefSecurityAlerts,
        prefMarketing: updatedUser.prefMarketing
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
