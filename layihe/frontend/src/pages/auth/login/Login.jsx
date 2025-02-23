import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { loginschema } from "../../../schema/LoginSchema";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/features/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const baseUrl = "http://localhost:5000/auth";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = async (values, actions) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", values, {
        withCredentials: true, 
      });
  
      if (res.status === 200) {
        dispatch(setUser(res.data));
        toast.success("Login successful");
        setTimeout(() => {
          navigate("/");
        }, 2000);
    
      } else {
        toast.error("Login failed");
      }
  
      actions.resetForm();
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    }
  };

  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: submitForm,
    validationSchema: loginschema,
  });

  return (
    <div className={styles.container}>
      <ToastContainer />
      <form
        encType="multipart/form-data"
        action=""
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h3>Login</h3>

        <div className={styles["form-group"]}>
          <label htmlFor="username">Username</label>
          <div className="text-danger">{errors.username}</div>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            onChange={handleChange}
            value={values.username}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="password">Password</label>
          <div className="text-danger">{errors.password}</div>
          <div className={styles["password-wrapper"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              value={values.password}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className={styles["password-icon"]}
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>
        <span>
          <Link to="/forgotpassword">Forgot password?</Link>
        </span>

        <button type="submit" className={styles.btn}>
          Login
        </button>

        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;