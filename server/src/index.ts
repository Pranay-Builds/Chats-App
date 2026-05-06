import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { userRoutes } from "./routes/user.routes.js";
import { friendRoutes } from "./routes/friends.routes.js";
import { cleanUnverifiedUsers } from "./jobs/cleanUnverifiedUsers.js";
import { protect } from "./middlewares/protect.middleware.js";
import { chatRoutes } from "./routes/chat.routes.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import { Server } from "socket.io";


const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

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
 * JSON only when not multipart (so file upload body is not consumed before multer)
 */
app.use((req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    return next();
  }
  express.json()(req, res, next);
});
app.use(cookieParser());


/**
 * Other routes
 */
 app.use("/api/users", protect, userRoutes);
 app.use("/api/friends", protect, friendRoutes);
 app.use("/api/chats", protect, chatRoutes);
 app.use("/api/messages", protect, messageRoutes);


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

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
