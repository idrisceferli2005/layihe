import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../redux/features/postSlice";
import styles from "./Posts.module.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      formData.append("image", image); 
    } else {
      toast.error("Please select an image");
      return;
    }
  
    try {
      await dispatch(createPost(formData)).unwrap();
      setContent("");
      setImage(null);
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create post");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h1>Create a Post</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a post..."
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Posts;