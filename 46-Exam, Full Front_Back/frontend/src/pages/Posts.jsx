import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost, createComment } from "../redux/features/postSlice";

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);
  console.log(posts)

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPost({ content, image }));
    setContent("");
    setImage("");
  };

  const handleCommentSubmit = (postId) => {
    dispatch(createComment({ postId, commentData: { content: commentContent } }));
    setCommentContent("");
  };

  return (
    <div>
      <h1>Posts</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a post..."
        />
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
        />
        <button type="submit">Post</button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post" />}
            <ul>
              {post.comments.map((comment) => (
                <li key={comment._id}>{comment.content}</li>
              ))}
            </ul>
            <form onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(post._id); }}>
              <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
              />
              <button type="submit">Comment</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;