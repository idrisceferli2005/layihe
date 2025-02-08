import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createComment, deleteComment } from "../../redux/features/postSlice";
import styles from "./Hero.module.css";

const Hero = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [commentContent, setCommentContent] = useState({});

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleCommentChange = (postId, value) => {
    setCommentContent((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = (postId) => {
    if (commentContent[postId]) {
      dispatch(createComment({ postId, commentData: { content: commentContent[postId] } }));
      setCommentContent((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const handleCommentDelete = (postId, commentId) => {
    dispatch(deleteComment({ postId, commentId }));
  };

  return (
    <div className={styles.container}>
      <h1>Home (Feed)</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post._id} className={styles.post}>
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post" />}
            <ul>
              {post.comments.map((comment) => (
                <li key={comment._id}>
                  {comment.content}
                  <button className="btn btn-danger" onClick={() => handleCommentDelete(post._id, comment._id)}>Delete</button>
                </li>
              ))}
            </ul>
            <form
              className={styles["comment-form"]}
              onSubmit={(e) => {
                e.preventDefault();
                handleCommentSubmit(post._id);
              }}
            >
              <input
                type="text"
                value={commentContent[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                placeholder="Write a comment..."
              />
              <button type="submit">Comment</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;