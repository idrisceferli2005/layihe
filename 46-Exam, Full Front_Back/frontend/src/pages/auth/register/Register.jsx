import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { registerschema } from "../../../schema/RegisterSchema";
import styles from "./Register.module.css"; // CSS modul import edildi

const Register = () => {
  const baseUrl = "http://localhost:5000/auth";

  const submitForm = async (values, actions) => {
    try {
      const formData = new FormData();
     
  
      if (values.image) {
        formData.append("image", values.image);
      } else {
        console.log('No image selected');
      }
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
  
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
  
      await axios.post(`${baseUrl}/register`, formData);
  
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
            onChange={(e) => setFieldValue("image", e.target.files[0])}
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
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            value={values.password}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="confirmpassword">Confirm Password</label>
          <div className={styles["text-danger"]}>{errors.confirmpassword}</div>
          <input
            type="password"
            id="confirmpassword"
            name="confirmpassword"
            className="form-control"
            onChange={handleChange}
            value={values.confirmpassword}
          />
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
