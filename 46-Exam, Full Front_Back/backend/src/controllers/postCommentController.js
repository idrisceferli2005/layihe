import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";

// Post yarat
export const createPost = async (req, res) => {
  try {
    const post = new Post({
      user: req.user._id,
      content: req.body.content,
      image: req.body.image,
    });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Şərh yarat
export const createComment = async (req, res) => {
  try {
    const comment = new Comment({
      user: req.user._id,
      post: req.params.postId,
      content: req.body.content,
    });
    const savedComment = await comment.save();
    const post = await Post.findById(req.params.postId);
    post.comments.push(savedComment._id);
    await post.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Postları əldə et
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").populate("comments");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};