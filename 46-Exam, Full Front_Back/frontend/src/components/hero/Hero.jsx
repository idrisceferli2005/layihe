import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createComment, deleteComment } from "../../redux/features/postSlice";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const Hero = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user); 

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
            <div className={styles.userInfo}>
            {post.user && post.user._id ? (
  <>
    <Link to={`/profile/${post.user._id}`}>
      <img src={post.user.image || 'default-image.jpg'} alt={post.user.username} className={styles.userImage} />
    </Link>
    <Link to={`/profile/${post.user._id}`}>
      <span>{post.user.username}</span>
    </Link>
  </>
) : (
  <p>User not available</p> 
)}
            </div>
            {post.image && <img src={post.image} alt="Post" />}
            <p>{post.content}</p>
            <div className={styles.actions}>
              <button onClick={() => handleLike(post._id)}>Like</button>
              <button onClick={() => handleUnlike(post._id)}>Unlike</button>
              <span>{post.likes?.length || 0} Likes</span>
            </div>
            <ul className={styles.comments}>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <li key={comment._id}>
                    {comment.content}
                    <button className="btn btn-danger" onClick={() => handleCommentDelete(post._id, comment._id)}>Delete</button>
                  </li> 
                ))
              ) : (
                <p>No comments yet.</p>
              )}
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
              <button type="submit">
                <FontAwesomeIcon icon={faComment} />
                Comment
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
