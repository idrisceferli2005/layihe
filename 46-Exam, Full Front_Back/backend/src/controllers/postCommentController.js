import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";


export const createPost = async (req, res) => {
  try {
    if (!req.body.content || !req.file) {
      return res.status(400).json({ message: "Content and image are required" });
    }
    const imageUrl = `images/${req.file.filename}`.replace(/\\/g, "/");
    const post = new Post({
      user: req.user._id,
      content: req.body.content,
      image: imageUrl,
    });

 
    const savedPost = await post.save();

    
    const user = await User.findById(req.user._id);
    if (user) {
      user.posts.push(savedPost._id);
      await user.save();
    }

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
    
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
  
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
     
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post tapılmadı" });

    const userId = req.user.id;

    if (post.dislikes.includes(userId)) {
    
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
    } else {
  
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    
      post.dislikes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};