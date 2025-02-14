import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate import edildi
import "./Navbar.scss";
import logoImg from "../../assets/images/logo.png.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaUserCircle, FaCommentDots } from "react-icons/fa";
import { loginUser, logoutUser } from "../../redux/features/userSlice";

const Navbar = () => {
  const baseUrl = "http://localhost:5000/auth";
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ useNavigate istifadəyə hazırdır

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
        navigate("/login"); // ✅ Logout olduqdan sonra login səhifəsinə yönləndirir
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout");
    }
  };

  const currentUser = user?.existUser?.isLogined ? user : null;
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    loginUser();
  }, [dispatch]);

  const admin = user?.existUser?.isAdmin;

  return (
    <div className="navbar-section">
      <div className="container">
        <div className="navbar">
          <div className="logo">
            <img src={logoImg} alt="" />
          </div>
          <ul className="navlist">
            <li className="navlist-item">
              <Link to="/">Home</Link>
            </li>
            {admin && (
              <li className="navlist-item">
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li className="navlist-item">
              <Link to="/search">Search</Link>
            </li>
            <li className="navlist-item">
              <Link to="/notifications">Notifications</Link>
            </li>
            <li className="navlist-item">
              <Link to="/posts">Posts</Link>
            </li>
            {user && user.existUser && user.existUser._id ? (
              <li>
                <Link to={`/profile/${user.existUser._id}`}>
                  <FaUserCircle />
                </Link>
              </li>
            ) : (
              <span>User profile not available</span>
            )}
          </ul>
          <div className="wrapper">
            <div className="chat-icon">
              <button onClick={toggleChat} className="btn btn-light">
                <FaCommentDots />
              </button>
            </div>
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
    </div>
  );
};

export default Navbar;
