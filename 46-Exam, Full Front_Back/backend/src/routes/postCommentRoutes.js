import express from "express";
import { createComment, createPost, getPosts } from "../controllers/postCommentController.js";
import { protect } from "../middleware/authMiddleware.js";

const postcommentRouter = express.Router();

postcommentRouter.post("/", protect, createPost);
postcommentRouter.post("/:postId/comments", protect, createComment);
postcommentRouter.get("/", protect, getPosts);

export default postcommentRouter; 
