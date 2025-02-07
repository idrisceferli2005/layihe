import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import logoImg from "../../assets/images/logo.png.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { loginUser, logoutUser } from "../../redux/features/UserSlice";

const Navbar = () => {
  const baseUrl = "http://localhost:5000/auth";
  

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await axios.get(`${baseUrl}/logout`);



    if (res.status === 200) {
      dispatch(logoutUser())
      alert("Logout successful");
    } else {
      alert("Logout failed");
    }
  };
  useEffect(() => {
  loginUser()
  } , [dispatch])

  
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
            <li className="navlist-item">
              <Link to="/category">Category</Link>
            </li>
            <li className="navlist-item">
              <Link to="/men">Men</Link>
            </li>
            <li className="navlist-item">
              <Link to="/women">Women</Link>
            </li>
            <li className="navlist-item">
              <Link to="/latest">Latest</Link>
            </li>
            <li className="navlist-item">
              <Link to="/admin">Admin</Link>
            </li>
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
   <Link to={`/profile/${user && user.existUser ? user.existUser._id : ''}`}>
  <FaUserCircle />
</Link>
  </li>
) : (
  <span>User profile not available</span>
)}
          </ul>
          <div className="wrapper">
  
            <div className="dropdown">
              <button
                className="btn btn-light"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="fa-solid fa-user"></i>
                {user && user.existUser ? user.existUser.username : "User"}
              </button>
              <ul className="dropdown-menu">
                {user ? (
                  <li onClick={handleLogout}>
                    <Link className="dropdown-item logout " to="/">
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
