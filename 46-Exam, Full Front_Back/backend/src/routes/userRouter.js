import express from "express";
import {
  banUser,
  deleteUser,
  forgotPassword,
  getCurrentUser,
  getUsers,
  login,
  logout,
  register,
  resetPassword,
  updateUserRole,
  verifyEmail,
} from "../controllers/userController.js";
import upload from "../upload/upload.js";
import { admin, protect } from "../middleware/authMiddleware.js";

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
userRouter.put("/:userId/role", protect, admin, updateUserRole);
userRouter.put("/:userId/ban", protect, admin, banUser);

export default userRouter;
