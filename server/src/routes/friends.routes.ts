import express from "express";
import { acceptFriendRequest, getFriendRequests, getFriends, rejectFriendRequest, removeFriend, sendFriendRequest } from "../controllers/friends.controller.js";

const router = express.Router();


router.post("/request", sendFriendRequest);
router.get("/requests", getFriendRequests);
router.delete("/request/:id", rejectFriendRequest);
router.post("/request/:id", acceptFriendRequest);
router.get("/", getFriends);
router.delete("/:friendId", removeFriend);


export { router as friendRoutes };