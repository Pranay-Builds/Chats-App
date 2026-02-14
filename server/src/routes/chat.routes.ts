import express from "express";
import { createGroupChat, getChatDetails, getChats, leaveChat } from "../controllers/chats.controllers.js";

const router = express.Router();

router.get("/", getChats);
router.get("/:chatId", getChatDetails);
router.post("/group", createGroupChat)
router.delete("/:chatId", leaveChat)

export { router as chatRoutes };