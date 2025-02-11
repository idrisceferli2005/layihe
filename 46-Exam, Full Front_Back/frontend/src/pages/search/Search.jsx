import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Search.module.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axios.get(`http://localhost:5000/api/search/users?q=${query}`);
      const postResponse = await axios.get(`http://localhost:5000/api/search/posts?q=${query}`);

      setUsers(userResponse.data || []);
      setPosts(postResponse.data || []);
    } catch (error) {
      console.error("Xəta baş verdi:", error);
      setError(error.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Axtar</h1>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İstifadəçiləri və ya postları axtar"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Axtar</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}

   
      <div className={styles.section}>
        <h2>İstifadəçilər</h2>
        <div className={styles.userGrid}>
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className={styles.userCard}>
                <Link to={`/profile/${user._id}`}>
                  <img src={user.image || "https://via.placeholder.com/70"} alt={user.username} className={styles.profilePic} />
                  <span className={styles.username}>{user.username}</span>
                </Link>
              </div>
            ))
          ) : (
            <p>İstifadəçi tapılmadı</p>
          )}
        </div>
      </div>

 
      <div className={styles.section}>
        <h2>Postlar</h2>
        <div className={styles.postGrid}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className={styles.postCard}>
                <Link to={`/post/${post._id}`}>
                  {post.image && <img src={post.image} alt="Post" className={styles.postImage} />}
                  <p>{post.content}</p>
                </Link>
              </div>
            ))
          ) : (
            <p>Post tapılmadı</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
