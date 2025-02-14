import express from "express";
import { acceptFriendRequest, followUser, removeFriend, sendFriendRequest, unfollowUser } from "../controllers/friendController.js";
import { protect } from "../middleware/authMiddleware.js";

const friendRoutes = express.Router();

friendRoutes.post("/send-request", protect, sendFriendRequest);
friendRoutes.post("/accept-request", protect, acceptFriendRequest);
friendRoutes.delete("/remove", protect, removeFriend)
friendRoutes.post("/follow", protect, followUser);
friendRoutes.post("/unfollow", protect, unfollowUser);

export default friendRoutes;