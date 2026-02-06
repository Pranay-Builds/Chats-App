import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { userRoutes } from "./routes/user.routes.js";
import { cleanUnverifiedUsers } from "./jobs/cleanUnverifiedUsers.js";
import { protect } from "./middlewares/protect.middleware.js";


const app = express();

/**
 * 1️⃣ CORS first (safe)
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/**
 * BETTER AUTH HANDLER (BEFORE json)
 */
app.all("/api/auth/*splat", toNodeHandler(auth));


/**
 * Other routes
 */
 app.use("/api/users", protect, userRoutes);

/**
 * JSON + cookies ONLY AFTER
 */
app.use(express.json());
app.use(cookieParser());


/**
 * Background jobs
 */
cleanUnverifiedUsers();

/**
 *  Test route
 */
app.get("/", (_req, res) => {
  res.json({ ok: true });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
