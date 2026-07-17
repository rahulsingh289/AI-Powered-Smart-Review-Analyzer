import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import passport from "passport";
import authRouter from "./authRoutes.js";
import reviewRouter from "./reviewRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for frontend Vite dev server origin and production deployments
app.use(cors({
  origin: (origin, callback) => {
    // Dynamically allow any requesting origin to prevent Vercel/Render CORS blockages
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

// Rate Limiter for Authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: "Too many login/registration attempts from this IP, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting specifically to register and login routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Mount routers
app.use("/api/auth", authRouter);
app.use("/api", reviewRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Express server
app.listen(PORT, () => {
  console.log("Backend server is running on http://localhost:" + PORT);
});
