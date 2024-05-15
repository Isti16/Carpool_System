import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebaseConfig";

const ProtectedRoute = () => {
  const isAuthenticated = auth.currentUser !== null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
