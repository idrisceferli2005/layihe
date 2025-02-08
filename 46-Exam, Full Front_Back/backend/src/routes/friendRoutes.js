import express from "express";
import { acceptFriendRequest, followUser, sendFriendRequest, unfollowUser } from "../controllers/friendController.js";

const friendRoutes = express.Router();

friendRoutes.post("/send-request", sendFriendRequest);
friendRoutes.post("/accept-request", acceptFriendRequest);
friendRoutes.post("/follow", followUser);
friendRoutes.post("/unfollow", unfollowUser);

export default friendRoutes;