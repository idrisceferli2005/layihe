import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaUserCircle, FaCommentDots, FaSearch, FaHome, FaBell, FaImage } from "react-icons/fa";
import { logoutUser } from "../../redux/features/userSlice";

const Navbar = () => {
  const baseUrl = "http://localhost:5000/auth";
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLogout = async () => {
    if (!user || !user.existUser || !user.existUser._id) {
      alert("User not found");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/logout`, { userId: user.existUser._id });

      if (res.status === 200) {
        dispatch(logoutUser());
        alert("Logout successful");
        navigate("/login");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout");
    }
  };

  const admin = user?.existUser?.isAdmin;

  return (
    <div className="navbar-section">
      <div className="container">
        <div className="navbar">
          <div className="wrapper">
            <Link to="/" className="navbar-item">
              <FaHome size={24} />
            </Link>
            <Link to="/search" className="navbar-item">
              <FaSearch size={24} />
            </Link>
            <Link to="/posts" className="navbar-item">
              <FaImage size={24} />
            </Link>
            <Link to="/notifications" className="navbar-item">
              <FaBell size={24} />
            </Link>

            {/* Chat Icon */}
            <div className="navbar-item">
              <button onClick={() => setIsChatOpen(!isChatOpen)} className="btn btn-light">
                <FaCommentDots size={24} />
              </button>
            </div>

            {user && user.existUser && user.existUser._id ? (
              <Link to={`/profile/${user.existUser._id}`} className="navbar-item">
                <FaUserCircle size={24} />
              </Link>
            ) : (
              <span>User profile not available</span>
            )}
          </div>

          <div className="wrapper">
            <div className="dropdown">
              <button className="btn btn-light" type="button" data-bs-toggle="dropdown">
                <i className="fa-solid fa-user"></i>
                {user && user.existUser ? user.existUser.username : "User"}
              </button>
              <ul className="dropdown-menu">
                {user ? (
                  <li onClick={handleLogout}>
                    <Link className="dropdown-item logout" to="/">
                      Logout
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item register" to="/register">
                        Register
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item login" to="/login">
                        Login
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h4>Chat</h4>
            <button onClick={() => setIsChatOpen(false)}>X</button>
          </div>
          <div className="chat-body">
            <p>Chat messages will appear here...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
