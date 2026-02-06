import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { cleanUnverifiedUsers } from "./jobs/cleanUnverifiedUsers.js";

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
 * 2️⃣ BETTER AUTH HANDLER (BEFORE json)
 */
app.all("/api/auth/*splat", toNodeHandler(auth));


app.get("/api/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});

/**
 * 3️⃣ JSON + cookies ONLY AFTER
 */
app.use(express.json());
app.use(cookieParser());


/**
 * Background jobs
 */
cleanUnverifiedUsers();

/**
 * 4️⃣ Test route
 */
app.get("/", (_req, res) => {
  res.json({ ok: true });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
