import express from "express";
import {
  addAdmin,
  banUser,
  deleteUser,
  forgotPassword,
  getCurrentUser,
  getUsers,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/userController.js";
import upload from "../upload/upload.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { friendProtect } from "../middleware/friendMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("image"), register);
userRouter.get("/verify/:token", verifyEmail);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/resetpassword", resetPassword);
userRouter.get("/me", protect, getCurrentUser);
userRouter.delete("/:id", protect, deleteUser);
userRouter.get("/", protect, getUsers);
userRouter.put("/:userId/role",  addAdmin);
userRouter.put("/:userId/ban",   banUser);

export default userRouter;
