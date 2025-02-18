import express from "express";
import { createComment, createPost, deleteComment, dislikePost, getPostById, getPosts, getUserPosts, likePost } from "../controllers/postCommentController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../upload/upload.js";

const postcommentRouter = express.Router();

postcommentRouter.post("/", protect, upload.single("image"), createPost);
postcommentRouter.post("/:postId/comments", protect, createComment);
postcommentRouter.get("/", protect, getPosts);
postcommentRouter.get("/:postId", protect, getPostById);
postcommentRouter.get("/user/:userId", protect, getUserPosts);
postcommentRouter.delete("/:postId/comments/:commentId", protect, deleteComment);
postcommentRouter.put("/like/:postId", protect, likePost);
postcommentRouter.put("/dislike/:postId", protect, dislikePost);

export default postcommentRouter; 
