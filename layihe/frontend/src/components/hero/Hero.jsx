import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createComment, deleteComment, likePost, dislikePost } from "../../redux/features/postSlice";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Hero = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user); 

  const [commentContent, setCommentContent] = useState({});

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCommentChange = (postId, value) => {
    setCommentContent((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = (postId) => {
    if (commentContent[postId]) {
      dispatch(createComment({ postId, commentData: { content: commentContent[postId] } }))
        .unwrap()
        .then(({ postId, comment }) => {
          // const updatedPosts = posts.map((post) => {
          //   if (post._id === postId) {
          //     return {
          //       ...post,
          //       comments: [...post.comments, comment],
          //     };
          //   }
          //   return post;
          // });
          setCommentContent((prev) => ({ ...prev, [postId]: "" }));
          toast.success("Comment added successfully!");
        })
        .catch((error) => {
          toast.error("Failed to add comment!");
        });
    } else {
      toast.error("Comment cannot be empty!");
    }
  };

  const handleCommentDelete = (postId, commentId) => {
    dispatch(deleteComment({ postId, commentId }))
      .unwrap()
      .then(({ postId, commentId }) => {
      
        // const updatedPosts = posts.map((post) => {
        //   if (post._id === postId) {
        //     return {
        //       ...post,
        //       comments: post.comments.filter((comment) => comment._id !== commentId),
        //     };
        //   }
        //   return post;
        // });
        toast.success("Comment deleted successfully!");
      })
      .catch((error) => {
        toast.error("Failed to delete comment!");
      });
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
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
                  <img src={`http://localhost:5000/${post.user.image}`} className={styles.userImage} />
                  </Link>
                  <Link to={`/profile/${post.user._id}`}>
                    <div className="text-dark">{post.user.username}</div>
                  </Link>
                </>
              ) : (
                <p>User not available</p> 
              )}
            </div>
            {post.image && <img src={`http://localhost:5000/${post.image}`} alt="Post" />}
            <p>{post.content}</p>
            <div className={styles.actions}>
              <button className={styles.number} onClick={() => dispatch(likePost(post._id))}>
                👍 {post?.likes?.length}
              </button>
              <button className={styles.number} onClick={() => dispatch(dislikePost(post._id))}>
                👎 {post?.dislikes?.length}
              </button>
            </div>
            <div className={styles.comments}>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment, index) => (
                  <div key={index} className={styles.commentItem}>
                             <Link to={`/profile/${comment.user?._id}`}>
                      <img
                        src={`http://localhost:5000/${comment?.user?.image}`}
                        alt={comment?.user?.username || "Unknown User"}
                      />
                    </Link>
                    <div className={styles.commentContent}>
                      <strong>{comment?.user?.username || "Unknown User"}</strong>
                      <p>{comment.content}</p>
                    </div>

                    {(user?.existUser && comment.user && (user?.existUser?._id === comment?.user?._id || user?.existUser?._id === post.user._id)) && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCommentDelete(post._id, comment._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            <form
              className={styles.commentForm}
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
                className={styles.commentInput}
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