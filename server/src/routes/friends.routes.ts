import express from "express";
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest, sendFriendRequest } from "../controllers/friends.controller.js";

const router = express.Router();


router.post("/request", sendFriendRequest);
router.get("/requests", getFriendRequests);
router.delete("/request/:id", rejectFriendRequest);
router.post("/request/:id", acceptFriendRequest);


export { router as friendRoutes };