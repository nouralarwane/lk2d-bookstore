import React from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { IsLoggedIn } = useContext(AuthContext);
  return IsLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
