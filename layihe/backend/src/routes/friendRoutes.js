import express from "express";
import { followUser,  unfollowUser } from "../controllers/friendController.js";
import { protect } from "../middleware/authMiddleware.js";
import { friendProtect } from "../middleware/friendMiddleware.js";

const friendRoutes = express.Router();


friendRoutes.post("/follow", friendProtect, followUser);
friendRoutes.post("/unfollow", friendProtect, unfollowUser);

export default friendRoutes;