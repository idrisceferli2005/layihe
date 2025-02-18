import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProfile, updateProfile } from "../../redux/features/profileSlice";
import styles from "./EditProfile.module.css";

const EditProfile = () => {
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

  useEffect(() => {
    if (id) {
      dispatch(fetchProfile(id));
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ id, user: formData }));
    navigate(`/profile/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
