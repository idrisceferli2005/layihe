import express from "express";
import { getUserProfile, updateProfile,  } from "../controllers/profileController.js";
import upload from "../upload/upload.js";

const profileRoutes = express.Router();

profileRoutes.get("/:id", getUserProfile);
profileRoutes.put("/:id", upload.single("image"), updateProfile);

export default profileRoutes;