import express from "express";
import { sendFriendRequest } from "../controllers/friends.controller.js";

const router = express.Router();


router.post("/request", sendFriendRequest)


export { router as friendRoutes };