import Post from "../models/postModel.js";
import User from "../models/userModel.js";


export const searchUsers = async (req, res) => {
  try {
    const users = await User.find({ username: { $regex: req.query.q, $options: "i" } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const searchPosts = async (req, res) => {
  try {
    const posts = await Post.find({ content: { $regex: req.query.q, $options: "i" } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};