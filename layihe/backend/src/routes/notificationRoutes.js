import express from "express";
import { createNotification, getNotifications } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";


const notificationRouter = express.Router();

notificationRouter.post("/", protect,  createNotification);
notificationRouter.get("/", protect, getNotifications);

export default notificationRouter;