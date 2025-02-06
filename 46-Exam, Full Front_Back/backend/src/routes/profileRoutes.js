import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/profileController.js";

const profileRoutes = express.Router();

profileRoutes.get("/:id", getUserProfile);
profileRoutes.put("/:id", updateUserProfile);

export default profileRoutes;