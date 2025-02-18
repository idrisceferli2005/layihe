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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
  
    if (image) {
      formData.append("image", image); // File obyektini əlavə et
    } else {
      alert("Please select an image");
      return;
    }
  
    dispatch(createPost(formData));
    setContent("");
    setImage(null);
    navigate("/");
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
  type="file"
  onChange={(e) => setImage(e.target.files[0])} // Faylı seç
  accept="image/*" // Yalnız şəkil fayllarını qəbul et
/>
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Posts;