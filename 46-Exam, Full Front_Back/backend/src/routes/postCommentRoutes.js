import express from "express";
import { createComment, createPost, deleteComment, getPostById, getPosts, getUserPosts } from "../controllers/postCommentController.js";
import { protect } from "../middleware/authMiddleware.js";

const postcommentRouter = express.Router();

postcommentRouter.post("/", protect, createPost);
postcommentRouter.post("/:postId/comments", protect, createComment);
postcommentRouter.get("/", protect, getPosts);
postcommentRouter.get("/:postId", protect, getPostById);
postcommentRouter.get("/user/:userId", protect, getUserPosts);
postcommentRouter.delete("/:postId/comments/:commentId", protect, deleteComment);

export default postcommentRouter; 
