import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const corsConfig = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}

// CORS - enable before other middleware
app.use(cors(corsConfig))


// Auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));


// Body parsing middleware
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Error handler - FIXED parameter order
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({
        error: process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});