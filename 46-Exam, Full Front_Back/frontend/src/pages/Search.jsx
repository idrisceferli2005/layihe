import React, { useState } from "react";
import axios from "axios";

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

      console.log("User Response:", userResponse.data);
      console.log("Post Response:", postResponse.data);

      setUsers(userResponse.data || []); 
      setPosts(postResponse.data || []);  
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or posts"
        />
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
      
      <div>
        <h2>Users</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user._id}>{user.username}</li>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
      </div>

      <div>
        <h2>Posts</h2>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post._id}>{post.content}</li>
            ))}
          </ul>
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
