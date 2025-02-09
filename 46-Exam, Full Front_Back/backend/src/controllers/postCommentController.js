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

// Bütün postları əldə et
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").populate("comments");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// İstifadəçinin postlarını əldə et
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId }); // userId ilə postları tapırıq
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user." });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Postu tap
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post tapılmadı" });
    }

    // Şərhi tap və sil
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Şərh tapılmadı" });
    }

    await Comment.findByIdAndDelete(commentId);

    // Postun içində olan şərhlərdən silirik
    post.comments = post.comments.filter((c) => c.toString() !== commentId);
    await post.save();

    res.json({ message: "Şərh uğurla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};