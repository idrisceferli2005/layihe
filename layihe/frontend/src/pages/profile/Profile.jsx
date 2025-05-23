import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./Profile.module.css";
import { fetchProfile } from "../../redux/features/profileSlice";
import { clearPosts, deletePost, fetchUserPosts } from "../../redux/features/postSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, loading, error } = useSelector((state) => state.profile);
  const { posts } = useSelector((state) => state.posts);
  
  useEffect(() => {
    dispatch(clearPosts());
    if (id) {
      dispatch(fetchProfile(id));
      dispatch(fetchUserPosts(id));
    }
  }, [dispatch, id]);

  const isOwnProfile = user?._id === id;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not found</p>;

  const isLogined = user.isLogined; 
  const isAdmin = user.isAdmin;

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Profile</h1>
      </div>

      <div className={styles.profileInfo}>
      <img src={`http://localhost:5000/${user.image}`} alt="Post" />
        <div className={styles.profileDetails}>
          <h2>{user.username} {isAdmin && <Link to="/admin">🛠 Admin Paneli</Link>}</h2>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>Posts: {posts.length}</p>
        </div>
      </div>

      {isLogined && (
        <button
          className={styles.editButton}
          onClick={() => navigate(`/edit-profile/${id}`)} 
        >
          Edit Profile
        </button>
      )}


      


      <div className={styles.posts}>
        {posts?.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className={styles.post}>
              <Link to={`/post/${post._id}`}>
                <p>{post.content}</p>
                {post.image && <img src={`http://localhost:5000/${post.image}`} alt="Post" />}
              </Link>
              {isLogined && (
                <div className={styles.postMenu}>
                  <span>⋮</span>
                  <div className={styles.postMenuContent}>
                    <button className="btn btn-danger" onClick={() => handleDeletePost(post._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;