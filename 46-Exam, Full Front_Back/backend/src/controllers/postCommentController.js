import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";


export const createPost = async (req, res) => {
  try {
    const post = new Post({
      user: req.user._id,
      content: req.body.content,
      image: req.body.image,
    });

    // Postu qeyd edin
    const savedPost = await post.save();

    // İstifadəçinin profilindəki posts sahəsinə bu postu əlavə edin
    const user = await User.findById(req.user._id);
    user.posts.push(savedPost._id); // Yaradılan postu istifadəçinin posts sahəsinə əlavə et
    await user.save();

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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


export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").populate("comments");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId });
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

  
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post tapılmadı" });
    }


    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Şərh tapılmadı" });
    }

    await Comment.findByIdAndDelete(commentId);


    post.comments = post.comments.filter((c) => c.toString() !== commentId);
    await post.save();

    res.json({ message: "Şərh uğurla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("user")
      .populate("comments");
    if (!post) {
      return res.status(404).json({ message: "Post tapılmadı" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post tapılmadı" });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      // Əgər artıq like edibsə, çıxar
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Əgər dislike edibsə, çıxar
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
      // Like əlavə et
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **Posta Dislike atmaq**
export const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post tapılmadı" });

    const userId = req.user.id;

    if (post.dislikes.includes(userId)) {
      // Əgər artıq dislike edibsə, çıxar
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
    } else {
      // Əgər like edibsə, çıxar
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      // Dislike əlavə et
      post.dislikes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

