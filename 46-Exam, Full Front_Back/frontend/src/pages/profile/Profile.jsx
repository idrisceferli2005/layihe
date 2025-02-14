import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import FriendRequest from "../friendrequest/FriendRequest";
import styles from "./Profile.module.css";
import { fetchProfile } from "../../redux/features/profileSlice";
import { fetchUserPosts } from "../../redux/features/postSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, loading, error } = useSelector((state) => state.profile);
  console.log(user)
  const { posts } = useSelector((state) => state.posts);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProfile(id));
      dispatch(fetchUserPosts(id));
    }
  }, [dispatch, id]);

  const isOwnProfile = user?._id === id;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not found</p>;

  const isLogined = user.isLogined; // Check if the user is logged in
  console.log(isLogined)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Profile</h1>
        {isLogined && ( // Only show edit button if it's the user's profile and they're logged in
          <button
            className={styles.editButton}
            onClick={() => navigate(`/edit-profile/${id}`)} // Redirect to the edit profile page
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className={styles.profileInfo}>
        <img src={user.image} alt="Profile" />
        <div className={styles.profileDetails}>
          <h2>{user.username}</h2>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>Followers: {user.followers?.length}</p>
          <p>Following: {user.following?.length}</p>
          <p>Posts: {posts.length}</p>
        </div>
      </div>

      {!isLogined && (
        <FriendRequest currentUserId={user._id} friendId={id} />
      )}
      <div className={styles.posts}>
        {posts?.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className={styles.post}>
              <Link to={`/post/${post._id}`}>
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="Post" />}
              </Link>
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
