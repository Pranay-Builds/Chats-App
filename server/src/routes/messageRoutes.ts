import express from "express";
import { getChatMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();


router.get("/:chatId", getChatMessages);
router.post("/", sendMessage)

export { router as messageRoutes };