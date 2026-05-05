import React from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { IsLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  return !IsLoggedIn ? children : <Navigate to="/profile" />;
};

export default PublicRoute;
