import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProfile, updateProfile } from "../../redux/features/profileSlice";

const Profile = () => {
  const { id } = useParams();
  console.log(id); 
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    image: ''
  });

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
    dispatch(updateProfile({ id, user: formData }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Image</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} />
        </div>
        {formData.image && (
          <div>
            <img src={formData.image} alt="Profile" style={{ width: '100px', height: '100px' }} />
          </div>
        )}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
