import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../redux/features/postSlice";
import styles from "./Posts.module.css";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPost({ content, image }));
    setContent("");
    setImage("");
    navigate("/"); // Post paylaşandan sonra ana səhifəyə yönləndir
  };

  return (
    <div className={styles.container}>
      <h1>Create a Post</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Posts;
