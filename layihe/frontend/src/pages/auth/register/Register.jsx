import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { registerschema } from "../../../schema/RegisterSchema";
import styles from "./Register.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const baseUrl = "http://localhost:5000/auth";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const submitForm = async (values, actions) => {
    try {
      const formData = new FormData();
        formData.append("image", values.image);
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
  
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
  
      await axios.post(`${baseUrl}/register`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      actions.resetForm();
  
      alert("Please check your email to verify your account.");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  
  const { values, handleChange, handleSubmit, setFieldValue, errors } =
    useFormik({
      initialValues: {
        image: "",
        name: "",
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
      },
      onSubmit: submitForm,
      validationSchema: registerschema,
    });

  return (
    <div className={styles.container}>
      <form
        encType="multipart/form-data"
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h3>Register</h3>

        <div className={styles["form-group"]}>
          <label htmlFor="image">Image</label>
          <input
  type="file"
  id="image"
  className="form-control"
  onChange={(e) => {
    console.log(e.target.files[0]); 
    setFieldValue("image", e.target.files[0]);
  }}
/>

        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="name">Name</label>
          <div className={styles["text-danger"]}>{errors.name}</div>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            onChange={handleChange}
            value={values.name}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="username">Username</label>
          <div className={styles["text-danger"]}>{errors.username}</div>
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
          <label htmlFor="email">Email</label>
          <div className={styles["text-danger"]}>{errors.email}</div>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            value={values.email}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="password">Password</label>
          <div className={styles["text-danger"]}>{errors.password}</div>
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

        <div className={styles["form-group"]}>
          <label htmlFor="confirmpassword">Confirm Password</label>
          <div className={styles["text-danger"]}>{errors.confirmpassword}</div>
          <div className={styles["password-wrapper"]}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmpassword"
              name="confirmpassword"
              className="form-control"
              onChange={handleChange}
              value={values.confirmpassword}
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              className={styles["password-icon"]}
              onClick={toggleConfirmPasswordVisibility}
            />
          </div>
        </div>

        <button type="submit" className={styles.btn}>
          Sign-Up
        </button>

        <span>
          Already have an account? <a href="/login">Login</a>
        </span>
      </form>
    </div>
  );
};

export default Register;