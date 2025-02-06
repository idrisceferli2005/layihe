import express from "express";
import { acceptFriendRequest, sendFriendRequest } from "../controllers/friendController.js";

const friendRoutes = express.Router();

friendRoutes.post("/send-request", sendFriendRequest);
friendRoutes.post("/accept-request", acceptFriendRequest);

export default friendRoutes;