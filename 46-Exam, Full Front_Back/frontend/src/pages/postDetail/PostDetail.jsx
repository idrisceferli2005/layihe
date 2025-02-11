import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./PostDetail.module.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState("");

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
  }, [id]);

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
      setCommentContent(""); // inputu təmizləyirik
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, response.data], // Yeni şərh əlavə edirik
      }));
    } catch (error) {
      setError("Şərh əlavə edilərkən xəta baş verdi.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Post Detalları</h1>
      {error && <p className={styles.error}>{error}</p>}
      {post ? (
        <div className={styles.postDetail}>
          <h2>{post.user.username}</h2>
          <img src={post.user.image} alt={post.user.username} className={styles.profilePic} />
          <p>{post.content}</p>
          {post.image && <img src={post.image} alt="Post image" className={styles.postImage} />}
          
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
                </li>
              ))}
            </ul>

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
