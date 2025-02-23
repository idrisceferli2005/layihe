
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import { useSelector } from "react-redux";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route
        {...rest}
        element={
          user && user.existUser._id ? (
            <Component /> 
          ) : (
            <Navigate to="/login" /> 
          )
        }
      />
    </Routes>
  );
};

export default PrivateRoute;
