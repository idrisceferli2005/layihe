import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import { banUser, deleteUser, getUsers, updateUserRole } from "../../redux/features/userSlice";
import "./Admin.scss";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user); 
  console.log("Users:", users);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getUsers()).then((res) => console.log(res)); 
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const handleUpdateRole = (userId) => {
    if (!userId) {
      console.error("User ID is required to update role.");
      return;
    }
    
   
    dispatch(updateUserRole({ userId, role: 'admin' }));
  };
  

  const handleBanUser = (id) => {
    if (window.confirm("Are you sure you want to ban this user?")) {
      dispatch(banUser(id));
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Users</h2>
      
      <input
        type="text"
        className="search-box"
        placeholder="İstifadəçi axtar..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Posts</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td><img src={user.image} alt="" /></td>
                <td>{user.name || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.username || "N/A"}</td>
                <td>{user.posts.length || "N/A"}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                  <button className="btn btn-warning" onClick={() => handleUpdateRole(user._id)}>
  Promote to Admin
</button>
                  <button className="btn btn-warning" onClick={() => handleBanUser(user._id)}>Ban</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No users found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPanel;
