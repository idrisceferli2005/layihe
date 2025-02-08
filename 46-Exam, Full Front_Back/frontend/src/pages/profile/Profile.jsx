import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProfile, updateProfile, setUser, logoutUser } from "../../redux/features/profileSlice";
import styles from "./Profile.module.css";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      console.log(`Fetching profile for id: ${id}`);
      dispatch(fetchProfile(id));
    } else {
      console.error("ID is undefined");
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        image: user.image || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ id, user: formData })).then(() => {
      dispatch(logoutUser()); // Profil yeniləndikdən sonra istifadəçidən çıxış edin
      navigate("/login"); // Profil yeniləndikdən sonra login səhifəsinə yönləndirin
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Profile</h1>
        <button className={styles.editButton} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>
      <div className={styles.profileInfo}>
        <img src={formData.image} alt="Profile" />
        <div className={styles.profileDetails}>
          <h2>{formData.username}</h2>
          <p>{formData.name}</p>
          <p>{formData.email}</p>
          <p>Followers: {user.followers.length}</p>
          <p>Following: {user.following.length}</p>
        </div>
      </div>
      {isEditing && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Image</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} />
          </div>
          <button className={styles.button} type="submit">Update Profile</button>
        </form>
      )}
      <div className={styles.posts}>
        {user.posts?.map((post) => (
          <div key={post._id} className={styles.post}>
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;