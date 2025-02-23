import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./PostDetail.module.css";
import { dislikePost, likePost } from "../../redux/features/postSlice";
import { useDispatch, useSelector } from "react-redux";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`, {
          withCredentials: true,
        });
        setPost(response.data);
      } catch (error) {
        console.error("Postu almaqda xəta:", error);
        setError("Post alınarkən xəta baş verdi.");
      }
    };

    fetchPost();
  }, [id, dispatch]);

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${id}/comments`,
        { content: commentContent },
        { withCredentials: true }
      );
      setCommentContent("");
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, response.data],
      }));
    } catch (error) {
      setError("Şərh əlavə edilərkən xəta baş verdi.");
    }
  };

  const handleLikePost = async () => {
    try {
      const response = await dispatch(likePost(post._id)).unwrap();
      setPost(response);
    } catch (error) {
      setError("Postu bəyənərkən xəta baş verdi.");
    }
  };

  const handleDislikePost = async () => {
    try {
      const response = await dispatch(dislikePost(post._id)).unwrap();
      setPost(response);
    } catch (error) {
      setError("Postu bəyənməməkdə xəta baş verdi.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}/comments/${commentId}`, {
        withCredentials: true,
      });
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.filter((comment) => comment._id !== commentId),
      }));
    } catch (error) {
      setError("Şərh silinərkən xəta baş verdi.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Post Detalları</h1>
      {error && <p className={styles.error}>{error}</p>}
      {post ? (
        <div className={styles.postDetail}>
          <div className="d-flex align-items-center  gap-1">
          <img src={`http://localhost:5000/${post.user.image}`} alt="Post"  className={styles.profilePic} />
            <h2>{post?.user?.username}</h2>
         
          </div>

          {post.image && <img src={`http://localhost:5000/${post.image}`} alt="Post" />}
          <p>{post.content}</p>
          <div className={styles.actions}>
            <button className={styles.number} onClick={handleLikePost}>
              👍 {post.likes.length}
            </button>
            <button className={styles.number} onClick={handleDislikePost}>
              👎 {post.dislikes.length}
            </button>
          </div>

          <div className={styles.comments}>
            <h3>Şərhlər</h3>
            <ul>
              {post.comments.map((comment, index) => (
                <li key={index} className={styles.commentItem}>
                  {comment.user && (
                    <div className={styles.commentHeader}>
                      <span>{comment.user.username}</span>
                    </div>
                  )}
                  <p>{comment.content}</p>
                  {(user.existUser && comment?.user && (user.existUser._id === comment?.user?._id || user?.existUser._id === post?.user?._id)) && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCommentDelete(comment._id)}
                    >
                      Delete

                    </button>
                    
                     
                    
                  )}
                </li>
              ))}
            </ul>
{
  console.log(user)
}
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <input
                type="text"
                value={commentContent}
                onChange={handleCommentChange}
                placeholder="Şərh yazın..."
                className={styles.commentInput}
              />
              <button type="submit">Şərh et</button>
            </form>
          </div>
        </div>
      ) : (
        <p>Post yüklənir...</p>
      )}
    </div>
  );
};

export default PostDetail;